import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { sendApi } from '../../util/apiUtil.js';

import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './ResetPasswordStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';

function ResetPasswordPage() {

    let content = null;
    const mainColors = ["red-background", "orange-background", "yellow-background", "green-background", "skyblue-background", "blue-background", "purple-background", "pink-background"];

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [mainColor, setMainColor] = useState();                       // 랜덤 색상 배경
    const [step, setStep] = useState("SEND_EMAIL");                     // 비밀번호 초기화 절차
    const [errorMessage, setErrorMessage] = useState("");               // 에러 메시지
    const [email, setEmail] = useState("");                             // 이메일
    const [sendEmailButton, setSendEmailButton] = useState("전송");     // 이메일 인증번호 전송 버튼 글자
    const [isSending, setIsSending] = useState(false);                  // 이메일 전송을 수행 중인지에 대한 여부

    // 페이지 마운트 시, 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        setMainColor(mainColors[Math.floor(Math.random() * mainColors.length)]);    // 랜덤 색상 배경 결정

    }, []);

    function changeEmail(e) { setEmail(e.target.value); }   // 이메일 타이핑

    // 비밀번호 초기화 버튼
    function resetPassword(e) {
        e.preventDefault();
        setErrorMessage("");
        setIsSending(true);
        setSendEmailButton("잠시만 기다려주십시오...");

        const resetPasswordApi = async () => {
            try {
                const response = await sendApi(
                    '/api/reset-password',
                    "POST",
                    false,
                    {
                        "email": email
                    }
                );

                setStep("FINISH");
            } catch (error) {
                setIsSending(false);
                setSendEmailButton("전송");
                setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
            }
        };

        resetPasswordApi();
    }

    if (step === "SEND_EMAIL") {
        content = <div id={style["container-email"]}>
            <h2 id={style["title-email"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>비밀번호 초기화</h2>
            <div id={style["subtitle-email"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                비밀번호를 변경할 계정의 이메일을 입력하여 주세요.
            </div>
            <form id={style["container-form"]} onSubmit={resetPassword}>
                <input type="text" name="email" placeholder="Email" value={email} onChange={changeEmail} className={style["input-email"]} required />
                <div id={style["errorMessage-email"]} className={colorStyle["red-font"]}>
                    {errorMessage}
                </div>
                <button type="submit" id={style["email-button"]} className={colorStyle[mainColor]} disabled={isSending}>{sendEmailButton}</button>
            </form>
        </div>
    }
    else if (step === "FINISH") {
        content = <div id={style["container-finish"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
            <h2 id={style["title-finish"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                비밀번호가 성공적으로 초기화 되었습니다.
            </h2>
            <div id={style["subtitle-finish"]}>이메일을 확인해주세요.</div>
            <Link to="/login" id={style["finish-button"]} className={colorStyle[mainColor]}>확인</Link>
        </div>
    }

    return (
        <div id={style["background"]}>
            {content}
        </div>
    );
}

export default ResetPasswordPage;