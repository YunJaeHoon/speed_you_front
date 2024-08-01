import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendApi } from '../../util/apiUtil.js';

import WaitServer from '../../component/WaitServer.js';

import SoundContext from "../../context/SoundContext.js";
import LoginContext from "../../context/LoginContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './UpdataInfoStyle.module.css';
import colorStyle from '../../style/Color.module.css';

import homeBackgroundMusic from '../../sound/home_background_music.mp3';

function UpdateInfo() {

    let content = null;
    const navigate = useNavigate();
    const mainColors = ["red-background", "orange-background", "yellow-background", "green-background", "skyblue-background", "blue-background", "purple-background", "pink-background"];
    const validUsernameCondition = /^(?=.*[a-zA-Z]|.*[가-힣]|=.*[0-9]).{2,16}$/;    // 닉네임 유효성 검사 정규식

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { setRole } = useContext(LoginContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [mainColor, setMainColor] = useState();                   // 랜덤 색상
    const [step, setStep] = useState("WRITE");                      // 절차
    const [errorMessage, setErrorMessage] = useState("");           // 에러 메시지
    const [username, setUsername] = useState("");                   // 닉네임
    const [validUsername, setValidUsername] = useState(false);      // 닉네임 유효성 여부

    // 페이지 마운트 시, 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        // 랜덤 색상 결정
        setMainColor(mainColors[Math.floor(Math.random() * mainColors.length)]);

    }, []);

    // 닉네임 타이핑
    function changeUsername(e) {
        setUsername(e.target.value);

        // 닉네임 유효성 검사
        if (validUsernameCondition.test(e.target.value))
            setValidUsername(true);
        else
            setValidUsername(false);
    }

    // 확인 버튼
    function updateUsername(e) {

        e.preventDefault();
        setErrorMessage("");
        setStep("PROCESSING")

        const updateUsernameApi = async () => {
            try {
                const response = await sendApi(
                    '/api/mypage/update-basic',
                    "POST",
                    true,
                    {
                        "username": username
                    }
                );

                setStep("FINISH");
            } catch (error) {

                if(error.response?.data?.code === "UNAUTHORIZED") {
                    window.alert("로그인이 필요합니다.");
                    setRole(null);
                    navigate('/login');
                }
                
                setStep("WRITE");
                setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
            }
        };

        updateUsernameApi();
    }

    if (step === "WRITE") {
        content = <div id={style["container"]}>
            <h2 id={style["title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>닉네임 변경</h2>
            <div id={style["subtitle"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                변경할 닉네임을 입력하여 주세요.
            </div>
            <form id={style["container-form"]} onSubmit={updateUsername}>
                <input
                    type="text"
                    name="username"
                    placeholder="닉네임"
                    value={username}
                    onChange={changeUsername}
                    className={`
                        ${style["input-username"]}
                        ${validUsername ? style["input-valid"] : style["input-invalid"]}
                    `}
                    required
                />
                <span className={`${style["input-invalid-message"]} ${colorStyle["red-font"]}`}>
                    {!validUsername && "* 닉네임은 2~16자리입니다."}
                </span>
                <div id={style["errorMessage"]} className={colorStyle["red-font"]}>
                    {errorMessage}
                </div>
                {
                    validUsername ?
                    <button type="submit" id={style["update-button"]} className={colorStyle[mainColor]}>확인</button> :
                    <button type="submit" id={style["update-button"]} className={colorStyle["grey-background"]} disabled>확인</button>
                }
            </form>
        </div>
    }
    else if (step === "PROCESSING") {
        content = <div id={style["wait-container"]}>
            <WaitServer />
        </div>
    }
    else if (step === "FINISH") {
        content = <div id={style["container-finish"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
            <h2 id={style["title-finish"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                닉네임이 성공적으로 변경되었습니다.
            </h2>
            <Link to="/mypage" id={style["finish-button"]} className={colorStyle[mainColor]}>확인</Link>
        </div>
    }

    return (
        <div id={style["background"]}>
            {content}
        </div>
    );
}

export default UpdateInfo;