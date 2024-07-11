import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendApi } from '../../util/apiUtil.js';
import axios from 'axios';

import SoundContext from "../../context/SoundContext.js";
import LoginContext from "../../context/LoginContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './LoginStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';

function LoginPage() {

    const navigate = useNavigate();
    const mainColors = ["red-background", "orange-background", "yellow-background", "green-background", "skyblue-background", "blue-background", "purple-background", "pink-background"];

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { setRole } = useContext(LoginContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [mainColor, setMainColor] = useState(1);           // 랜덤 색상 index
    const [email, setEmail] = useState("");                  // 이메일
    const [password, setPassword] = useState("");            // 비밀번호
    const [rememberMe, setRememberMe] = useState(false);     // 로그인 정보 저장 여부
    const [errorMessage, setErrorMessage] = useState("");    // 에러 메시지

    // 페이지 마운트 시, 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        setMainColor(Math.floor(Math.random() * mainColors.length));    // 랜덤 색상 index 결정

    }, []);

    // 로그인 함수
    function login(e) {
        e.preventDefault();
        setErrorMessage("");

        axios.post('/api/login', {
            "email": email,
            "password": password,
            "remember-me": rememberMe
        }, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        .then((response) => {

            // header에 Authorization 값으로 access token 넣기
            axios.defaults.headers.common['Authorization'] = response.data.data.accessToken;

            // localStorage에 access token 넣기
            window.localStorage.setItem("accessToken", response.data.data.accessToken);

            // localStroage에 refresh token 넣기
            if (rememberMe)
                window.localStorage.setItem("refreshToken", response.data.data.refreshToken);

            const getRole = async () => {
                try {
                    const response = await sendApi(
                        '/api/get-role',
                        "GET",
                        true,
                        null
                    );
                    setRole(response);
                    navigate('/');
                } catch (error) {
                    setRole(null);
                    setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
                }
            };

            getRole();
        })
        .catch((error) => {
            setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
        });
    }

    function changeEmail(e) { setEmail(e.target.value); }           // 이메일 타이핑
    function changePassword(e) { setPassword(e.target.value); }     // 비밀번호 타이핑
    function checkRememberMe() { setRememberMe(!rememberMe); }      // '로그인 정보 저장' 체크

    return (
        <div id={style["background"]}>
            <div id={style["container"]}>
                <h2 id={style["title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>환영합니다</h2>
                <form id={style["form-container"]} onSubmit={login}>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={changeEmail}
                        placeholder="Email"
                        className={style["input"]}
                    required />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={changePassword}
                        placeholder="Password"
                        className={style["input"]}
                    required />
                    <div id={style["rememberMe-and-resetPassword-container"]}>
                        <span id={style["rememberMe-container"]}>
                            <span id={style["rememberMe-description"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>로그인 정보 저장</span>
                            <input type="checkbox" id="rememberMe" name="remember-me" className={style["rememberMe"]} onChange={checkRememberMe} />
                            <label
                                htmlFor="rememberMe"
                                className={
                                    rememberMe ? colorStyle[mainColors[mainColor]] :
                                    theme === "LIGHT" ? colorStyle["white-background"] : colorStyle["black-background"]
                                }
                                style={
                                    theme === "LIGHT" ? {border: "0.25vh solid #20201E"} : {border: "0.25vh solid #FFFFFF"}
                                }
                            >
                            </label>
                        </span>
                        <span>
                            <Link to="/reset-password" id={style["resetPassword"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>비밀번호를 잊으셨습니까?</Link>
                        </span>
                    </div>
                    <div id={style["errorMessage"]} className={colorStyle["red-font"]}>
                        {errorMessage}
                    </div>
                    <button type="submit" id={style["login-button"]} className={colorStyle[mainColors[mainColor]]}>로그인</button>
                </form>
                <div id={style["or-container"]}>
                    <div className={style["or-line"]} style={theme === "LIGHT" ? {backgroundColor: "#AFAFAF"} : {backgroundColor: "#FFFFFF"}}></div>
                    <div id={style["or"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>또는</div>
                    <div className={style["or-line"]} style={theme === "LIGHT" ? {backgroundColor: "#AFAFAF"} : {backgroundColor: "#FFFFFF"}}></div>
                </div>
                <Link
                    to="/join"
                    id={style["join-button"]}
                    className={`
                        ${
                            theme === "LIGHT" ? colorStyle["black-background"] : colorStyle["white-background"]
                        }
                        ${
                            theme === "LIGHT" ? colorStyle["white-font"] : colorStyle["black-font"]
                        }
                    `}
                >
                회원가입
                </Link>
            </div>
        </div>
    );
}

export default LoginPage;