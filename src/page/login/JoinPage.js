import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { sendApi } from '../../util/apiUtil.js';

import Term from '../../component/Term.js';
import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './JoinStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';

function JoinPage() {

    let content = null;
    const mainColors = ["red-background", "orange-background", "yellow-background", "green-background", "skyblue-background", "blue-background", "purple-background", "pink-background"];
    const validPasswordCondition = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/;            // 비밀번호 유효성 검사 정규식
    const validUsernameCondition = /^(?=.*[a-zA-Z]|.*[가-힣]|=.*[0-9]).{2,16}$/;    // 닉네임 유효성 검사 정규식

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [mainColor, setMainColor] = useState();                       // 랜덤 색상 배경
    const [step, setStep] = useState("AGREE_TERM");                     // 회원가입 절차
    const [errorMessage, setErrorMessage] = useState("");               // 에러 메시지
    const [agreeServiceTerm, setAgreeServiceTerm] = useState(false);    // 이용약관 동의 여부
    const [agreePrivacyTerm, setAgreePrivacyTerm] = useState(false);    // 개인정보처리방침 동의 여부
    const [code, setCode] = useState("");                               // 인증번호
    const [email, setEmail] = useState("");                             // 이메일
    const [username, setUsername] = useState("");                       // 닉네임
    const [password, setPassword] = useState("");                       // 비밀번호
    const [confirmPassword, setConfirmPassword] = useState("");         // 비밀번호 확인
    const [sendEmailButton, setSendEmailButton] = useState("전송");     // 이메일 인증번호 전송 버튼 글자
    const [isSending, setIsSending] = useState(false);                  // 이메일 전송을 수행 중인지에 대한 여부
    const [validPassword, setValidPassword] = useState(false);          // 비밀번호 유효성 여부
    const [equalPassword, setEqualPassword] = useState(true);           // 비밀번호 확인 일치 여부
    const [validUsername, setValidUsername] = useState(false);          // 닉네임 유효성 여부
    const [viewPassword, setViewPassword] = useState(false);            // 비밀번호 보기 여부

    // 페이지 마운트 시, 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        setMainColor(mainColors[Math.floor(Math.random() * mainColors.length)]);    // 랜덤 색상 배경 결정

    }, []);

    function changeCode(e) { setCode(e.target.value); }     // 인증번호 타이핑
    function changeEmail(e) { setEmail(e.target.value); }   // 이메일 타이핑

    // 비밀번호 타이핑
    function changePassword(e) {
        setPassword(e.target.value);

        // 비밀번호 유효성 검사
        if (validPasswordCondition.test(e.target.value))
            setValidPassword(true);
        else
            setValidPassword(false);

        // 비밀번호 확인 일치 검사
        if (e.target.value === confirmPassword)
            setEqualPassword(true);
        else
            setEqualPassword(false);
    }
    
    // 비밀번호 확인 타이핑
    function changeConfirmPassword(e) {
        setConfirmPassword(e.target.value);

        // 비밀번호 확인 일치 검사
        if (password === e.target.value)
            setEqualPassword(true);
        else
            setEqualPassword(false);
    }

    // 닉네임 타이핑
    function changeUsername(e) {
        setUsername(e.target.value);

        // 닉네임 유효성 검사
        if (validUsernameCondition.test(e.target.value))
            setValidUsername(true);
        else
            setValidUsername(false);
    }

    function checkViewPassword() { setViewPassword(!viewPassword); }        // '비밀번호 보기' 체크
    function agreeAllTerm() { setStep("SEND_EMAIL"); }                      // 이용약관 전체 동의 버튼
    function checkService() { setAgreeServiceTerm(!agreeServiceTerm); }     // 서비스 이용약관 체크
    function checkPrivacy() { setAgreePrivacyTerm(!agreePrivacyTerm); }     // 개인정보처리방침 체크

    // 인증번호 이메일 전송 함수
    function sendEmail(e) {
        e.preventDefault();
        setErrorMessage("");
        setIsSending(true);
        setSendEmailButton("잠시만 기다려주십시오...");

        const sendEmailApi = async () => {
            try {
                const response = await sendApi(
                    '/api/join/send-email',
                    "POST",
                    false,
                    {
                        "email": email
                    }
                );

                setStep("CHECK_EMAIL");
            } catch (error) {
                setSendEmailButton("전송");
                setIsSending(false);
                setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
            }
        };

        sendEmailApi();
    }

    // 인증번호 확인 함수
    function checkEmail(e) {
        e.preventDefault();
        setErrorMessage("");

        const checkEmailApi = async () => {
            try {
                const response = await sendApi(
                    '/api/join/check-email',
                    "POST",
                    false,
                    {
                        "email": email,
                        "code": code
                    }
                );

                setStep("JOIN");
            } catch (error) {
                setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
            }
        };

        checkEmailApi();
    }

    // 회원가입 함수
    function join(e) {
        e.preventDefault();
        setErrorMessage("");

        const joinApi = async () => {
            try {
                await sendApi(
                    '/api/join',
                    "POST",
                    false,
                    {
                        email: email,
                        password: password,
                        username: username,
                        code: code
                    }
                );

                setStep("FINISH");
            } catch (error) {
                setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
            }
        };

        joinApi();
    }

    if (step === "AGREE_TERM") {
        content = <div id={style["container-agreeTerm"]}>
            <h2 id={style["title-agreeTerm"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>서비스 이용약관 동의</h2>
            <div className={style["container-term"]}>
                <div className={style["container-term-description"]}>
                    <span className={`${style["term-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>
                        이용약관 (필수)
                    </span>
                    <span>
                        <input type="checkbox" id="serviceTerm" name="serviceTerm" className={style["checkbox"]} onChange={checkService} />
                        <label
                            htmlFor="serviceTerm"
                            className={
                                agreeServiceTerm ? colorStyle[mainColor] :
                                theme === "LIGHT" ? colorStyle["white-background"] : colorStyle["black-background"]
                            }
                            style={
                                theme === "LIGHT" ? {border: "0.25vh solid #20201E"} : {border: "0.25vh solid #FFFFFF"}
                            }
                        >
                        </label>
                    </span>
                </div>
                <Term about="SERVICE" />
            </div>
            <div className={style["container-term"]}>
                <div className={style["container-term-description"]}>
                    <span className={`${style["term-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>
                        개인정보처리방침 (필수)
                    </span>
                    <span>
                        <input type="checkbox" id="privacyTerm" name="privacyTerm" className={style["checkbox"]} onChange={checkPrivacy} />
                        <label
                            htmlFor="privacyTerm"
                            className={
                                agreePrivacyTerm ? colorStyle[mainColor] :
                                theme === "LIGHT" ? colorStyle["white-background"] : colorStyle["black-background"]
                            }
                            style={
                                theme === "LIGHT" ? {border: "0.25vh solid #20201E"} : {border: "0.25vh solid #FFFFFF"}
                            }
                        >
                        </label>
                    </span>
                </div>
                <Term about="PRIVACY" />
            </div>
            <div id={style["container-agree-button"]}>
                {
                    (agreeServiceTerm && agreePrivacyTerm) ?
                        <button type="button" onClick={agreeAllTerm} id={style["agree-button"]} className={colorStyle[mainColor]}>이용약관 전체 동의</button> :
                        <button type="button" onClick={agreeAllTerm} id={style["agree-button"]} className={colorStyle["grey-background"]} disabled>이용약관 전체 동의</button>
                }
            </div>
        </div>
    }
    else if (step === "SEND_EMAIL") {
        content = <div id={style["container-email"]}>
            <h2 id={style["title-email"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>이메일 인증번호 전송</h2>
            <div id={style["subtitle-email"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                계정을 등록할 이메일을 입력하여 주세요.
            </div>
            <form id={style["container-form"]} onSubmit={sendEmail}>
                <input type="email" name="email" placeholder="Email" value={email} onChange={changeEmail} className={style["input-email"]} required />
                <div id={style["errorMessage-email"]} className={colorStyle["red-font"]}>
                    {errorMessage}
                </div>
                <button type="submit" id={style["email-button"]} className={colorStyle[mainColor]} disabled={isSending}>{sendEmailButton}</button>
            </form>
        </div>
    }
    else if (step === "CHECK_EMAIL") {
        content = <div id={style["container-email"]}>
            <h2 id={style["title-email"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>인증번호 확인</h2>
            <div id={style["subtitle-email"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                이메일로 전송된 인증번호를 입력하여 주세요.
            </div>
            <form id={style["container-form"]} onSubmit={checkEmail}>
                <input type="text" name="code" placeholder="인증번호" value={code} onChange={changeCode} className={style["input-email"]} required />
                <div id={style["errorMessage-email"]} className={colorStyle["red-font"]}>
                    {errorMessage}
                </div>
                <button type="submit" id={style["email-button"]} className={colorStyle[mainColor]}>확인</button>
            </form>
        </div>
    }
    else if (step === "JOIN") {
        content = <div id={style["container-join"]}>
            <h2 id={style["title-join"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>회원가입</h2>
            <form className={style["container-form"]} onSubmit={join}>
                <div
                    className={`
                        ${style["input-description"]}
                        ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
                    `}
                >
                    이메일
                </div>
                <input
                    type="email"
                    name="email"
                    value={email}
                    className={`
                        ${style["input-join-disabled"]}
                        ${colorStyle["black-font"]}
                    `}
                    disabled
                />
                <div className={style["input-description-container"]}>
                    <span className={`${style["input-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>비밀번호</span>
                    <span className={`${style["input-invalid-message"]} ${colorStyle["red-font"]}`}>
                        {!validPassword && "* 비밀번호는 영문과 숫자를 포함한 8~16자리입니다."}
                    </span>
                </div>
                <input
                    type={viewPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={changePassword}
                    className={`
                        ${style["input-join"]}
                        ${colorStyle["black-font"]}
                        ${validPassword ? style["input-join-valid"] : style["input-join-invalid"]}
                    `}
                    required
                />
                <div className={style["input-description-container"]}>
                    <span className={`${style["input-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>비밀번호 확인</span>
                    <span className={`${style["input-invalid-message"]} ${colorStyle["red-font"]}`}>
                        {!equalPassword && "* 비밀번호가 일치하지 않습니다."}
                    </span>
                </div>
                <input
                    type={viewPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={changeConfirmPassword}
                    className={`
                        ${style["input-join"]}
                        ${colorStyle["black-font"]}
                        ${equalPassword ? style["input-join-valid"] : style["input-join-invalid"]}
                    `}
                    required
                />
                <div className={style["viewPassword-container"]}>
                    <span className={`${style["viewPassword-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>비밀번호 보기</span>
                    <input type="checkbox" id="viewPassword" name="viewPassword" className={style["checkbox"]} onChange={checkViewPassword} />
                    <label
                        htmlFor="viewPassword"
                        className={
                            viewPassword ? colorStyle[mainColor] :
                            theme === "LIGHT" ? colorStyle["white-background"] : colorStyle["black-background"]
                        }
                        style={
                            theme === "LIGHT" ? {border: "0.25vh solid #20201E"} : {border: "0.25vh solid #FFFFFF"}
                        }
                    >
                    </label>
                </div>
                <div className={style["input-description-container"]}>
                    <span className={`${style["input-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>닉네임</span>
                    <span className={`${style["input-invalid-message"]} ${colorStyle["red-font"]}`}>
                        {!validUsername && "* 닉네임은 2~16자리입니다."}
                    </span>
                </div>
                <input type="text" name="username" value={username} onChange={changeUsername} className={`${style["input-join"]} ${colorStyle["black-font"]} ${validUsername ? style["input-join-valid"] : style["input-join-invalid"]}`} required />
                <div id={style["errorMessage-join"]} className={colorStyle["red-font"]}>
                    {errorMessage}
                </div>
                {
                    (validPassword && equalPassword && validUsername) ?
                        <button type="submit" id={style["join-button"]} className={colorStyle[mainColor]}>회원가입</button> :
                        <button type="submit" id={style["join-button"]} className={colorStyle["grey-background"]} disabled>회원가입</button>
                }
            </form>
        </div>
    }
    else if (step === "FINISH") {
        content = <div id={style["container-finish"]}>
            <h2 id={style["title-finish"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>회원가입에 성공하였습니다.</h2>
            <Link to="/login" id={style["finish-button"]} className={colorStyle[mainColor]}>확인</Link>
        </div>
    }

    return (
        <div id={style["background"]}>
            {content}
        </div>
    );
}

export default JoinPage;