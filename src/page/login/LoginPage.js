import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import SoundContext from "../../context/SoundContext.js";
import LoginContext from "../../context/LoginContext.js";

import style from '../../style/page_style/login/LoginStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';

function LoginPage() {
    const navigate = useNavigate();

    const mainColors = ["red-main", "orange-main", "yellow-main", "green-main", "skyblue-main", "blue-main", "purple-main", "pink-main"];

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { setRole } = useContext(LoginContext);

    // state
    const [mainColor, setMainColor] = useState(1);           // 랜덤 색상 index
    const [email, setEmail] = useState("");                  // 이메일
    const [password, setPassword] = useState("");            // 비밀번호
    const [rememberMe, setRememberMe] = useState(false);     // 로그인 정보 저장 여부
    const [errorMessage, setErrorMessage] = useState("");    // 에러 메시지

    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        setMainColor(Math.floor(Math.random() * mainColors.length));    // 랜덤 색상 index 결정

    }, []);

    function login(e) {
        e.preventDefault();
        setErrorMessage("");

        axios.post('/api/login',
            {
                "email": email,
                "password": password,
                "remember-me": rememberMe
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then((response) => {

                // header에 Authorization 값으로 토큰 넣기
                axios.defaults.headers.common['Authorization'] = response.data.data;

                // localStorage에 토큰 값 넣기
                window.localStorage.setItem("token", response.data.data);

                // 계정 권한 확인
                axios.get('/api/get-role',
                    {
                        headers: {
                            Authorization: `Bearer ${window.localStorage.getItem('token')}`
                        }
                    })
                    .then((response) => {
                        setRole(response.data.data);
                    })
                    .catch((error) => {
                        setRole(null);
                    });

                navigate('/');
            })
            .catch((error) => {
                setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
            });
    }

    function changeEmail(e) { setEmail(e.target.value); }           // 이메일 타이핑
    function changePassword(e) { setPassword(e.target.value); }     // 비밀번호 타이핑
    function checkRememberMe() { setRememberMe(!rememberMe); }      // '로그인 정보 저장' 체크

    return (
        <div id={style["background"]} className={colorStyle["white-main"]}>
            <div id={style["container"]}>
                <h2 id={style["title"]}>환영합니다</h2>
                <form onSubmit={login}>
                    <div>
                        <input type="email" name="email" value={email} onChange={changeEmail} placeholder="Email" className={style["input"]} required />
                    </div>
                    <div>
                        <input type="password" name="password" value={password} onChange={changePassword} placeholder="Password" className={style["input"]} required />
                    </div>
                    <div id={style["rememberMe-and-resetPassword-block"]}>
                        <span id={style["rememberMe-block"]}>
                            <span id={style["rememberMe-description"]}>로그인 정보 저장</span>
                            <input type="checkbox" id="remember-me" name="remember-me" className={style["checkbox"]} onChange={checkRememberMe} />
                            <label htmlFor="remember-me" className={rememberMe ? colorStyle[mainColors[mainColor]] : colorStyle["white-main"]}></label>
                        </span>
                        <span>
                            <Link to="/reset-password" id={style["resetPassword"]}>비밀번호를 잊으셨습니까?</Link>
                        </span>
                    </div>
                    <div id={style["errorMessage"]}>
                        {errorMessage}
                    </div>
                    <button type="submit" id={style["submit-button"]} className={colorStyle[mainColors[mainColor]]}>로그인</button>
                </form>
                <div id={style["or-container"]}>
                    <div className={style["or-line"]}></div>
                    <div id={style["or"]}>또는</div>
                    <div className={style["or-line"]}></div>
                </div>
                <div id={style["join-button-block"]}>
                    <Link to="/join" id={style["join-button"]} className={colorStyle["black-main"]}>회원가입</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;