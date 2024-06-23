import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Header from '../../component/Header';

import style from '../../style/LoginStyle.module.css';
import colorStyle from '../../style/Color.module.css';

function ResetPasswordPage() {

    let content = null;
    const mainColors = ["red-main", "orange-main", "yellow-main", "green-main", "skyblue-main", "blue-main", "purple-main", "pink-main"];

    // state
    const [mainColor, setMainColor] = useState("yellow-main");          // 랜덤 색상 배경
    const [step, setStep] = useState("RESET_PASSWORD");                 // 비밀번호 초기화 절차
    const [errorMessage, setErrorMessage] = useState("");               // 에러 메시지
    const [email, setEmail] = useState("");                             // 이메일
    const [sendEmailButton, setSendEmailButton] = useState("전송");      // 이메일 인증번호 전송 버튼 글자
    const [isSending, setIsSending] = useState(false);                  // 이메일 전송을 수행 중인지에 대한 여부

    // 랜덤 색상 배경 결정
    useEffect(() => {
        setMainColor(mainColors[Math.floor(Math.random() * mainColors.length)]);
    }, []);

    function changeEmail(e) { setEmail(e.target.value); }   // 이메일 타이핑

    // 비밀번호 초기화 버튼
    function resetPassword(e)
    {
        e.preventDefault();
        setErrorMessage("");
        setIsSending(true);
        setSendEmailButton("잠시만 기다려주십시오...");

        axios.post('/api/reset-password', {
            email: email
        })
        .then((response) => {
            setStep("RESET_PASSWORD_FINISH");
        })
        .catch((error) => {
            setIsSending(false);
            setSendEmailButton("전송");
            setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
        });
    }

    if(step === "RESET_PASSWORD")
    {
        content = <div id={style["background"]} className={colorStyle["white-main"]}>
            <div id={style["container-join-finish"]}>
                <h2 id={style["title"]}>비밀번호 초기화</h2>
                <div id={style["title-pair-small"]}>
                    비밀번호를 변경할 계정의 이메일을 입력하여 주세요.
                </div>
                <form className={style["form-block"]} onSubmit={resetPassword}>
                    <input type="text" name="email" placeholder="Email" value={email} onChange={changeEmail} className={style["input-reset-password"]} required/>
                    <div id={style["errorMessage"]}>
                        {errorMessage}
                    </div>
                    <button type="submit" id={style["reset-password-button"]} className={colorStyle[mainColor]} disabled={isSending}>{sendEmailButton}</button>
                </form>
            </div>
        </div>
    }
    else if(step === "RESET_PASSWORD_FINISH")
    {
        content = <div id={style["background"]} className={colorStyle["white-main"]}>
            <div id={style["container-join-finish"]}>
                <h2 id={style["title-pair-big"]}>비밀번호가 성공적으로 초기화 되었습니다.</h2>
                <div id={style["title-pair-small"]}>이메일을 확인해주세요.</div>
                <div className={style["finish-button-block"]}>
                    <Link to="/login" id={style["finish-button"]} className={colorStyle[mainColor]}>확인</Link>
                </div>
            </div>
        </div>
    }

    return (
        <div>
            <Header />
            {content}
        </div>
    );
}

export default ResetPasswordPage;