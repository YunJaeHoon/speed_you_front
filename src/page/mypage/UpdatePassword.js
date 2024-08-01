import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendApi } from '../../util/apiUtil.js';

import WaitServer from '../../component/WaitServer.js';

import SoundContext from "../../context/SoundContext.js";
import LoginContext from "../../context/LoginContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './UpdatePasswordStyle.module.css';
import colorStyle from '../../style/Color.module.css';

import homeBackgroundMusic from '../../sound/home_background_music.mp3';

function UpdatePassword() {

    let content = null;
    const navigate = useNavigate();
    const mainColors = ["red-background", "orange-background", "yellow-background", "green-background", "skyblue-background", "blue-background", "purple-background", "pink-background"];
    const validPasswordCondition = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/;            // 비밀번호 유효성 검사 정규식

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { setRole } = useContext(LoginContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [mainColor, setMainColor] = useState();                   // 랜덤 색상
    const [step, setStep] = useState("WRITE");                      // 절차
    const [errorMessage, setErrorMessage] = useState("");           // 에러 메시지
    const [password, setPassword] = useState("");                   // 기존 비밀번호
    const [newPassword, setNewPassword] = useState("");             // 새로운 비밀번호
    const [checkNewPassword, setCheckNewPassword] = useState("");   // 새로운 비밀번호 확인
    const [validPassword, setValidPassword] = useState(false);      // 비밀번호 유효성 여부
    const [equalPassword, setEqualPassword] = useState(false);      // 비밀번호 일치 여부
    const [viewPassword, setViewPassword] = useState(false);        // 비밀번호 보기 여부

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

    // 기존 비밀번호 타이핑
    function changePassword(e) {
        setPassword(e.target.value);
    }

    // 비밀번호 타이핑
    function changeNewPassword(e) {
        setNewPassword(e.target.value);

        // 비밀번호 유효성 검사
        if (validPasswordCondition.test(e.target.value))
            setValidPassword(true);
        else
            setValidPassword(false);

        // 비밀번호 확인 일치 검사
        if (e.target.value === checkNewPassword)
            setEqualPassword(true);
        else
            setEqualPassword(false);
    }

    // 비밀번호 확인 타이핑
    function changeCheckNewPassword(e) {
        setCheckNewPassword(e.target.value);

        // 비밀번호 확인 일치 검사
        if (newPassword === e.target.value)
            setEqualPassword(true);
        else
            setEqualPassword(false);
    }

    // '비밀번호 보기' 체크
    function checkViewPassword() {
        setViewPassword(!viewPassword);
    }

    // 확인 버튼
    function updatePassword(e) {

        e.preventDefault();
        setErrorMessage("");
        setStep("PROCESSING")

        const updatePasswordApi = async () => {
            try {
                await sendApi(
                    '/api/mypage/check-password',
                    "POST",
                    true,
                    {
                        "password": password
                    }
                );

                try {
                    await sendApi(
                        '/api/mypage/update-password',
                        "POST",
                        true,
                        {
                            "password": newPassword
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
            } catch (error) {

                if(error.response?.data?.code === "UNAUTHORIZED") {
                    window.alert("로그인이 필요합니다.");
                    setRole(null);
                    navigate('/login');
                }
                else if(error.response?.data?.code === "WRONG_PASSWORD") {
                    setErrorMessage("기존 비밀번호가 틀렸습니다.")
                }
                else {
                    setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
                }
                
                setStep("WRITE");
            }
        };

        updatePasswordApi();
    }

    if (step === "WRITE") {
        content = <div id={style["container"]}>
            <h2 id={style["title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>비밀번호 변경</h2>
            <form id={style["container-form"]} onSubmit={updatePassword}>
                <input
                    type={viewPassword ? "text" : "password"}
                    name="password"
                    placeholder="기존 비밀번호"
                    value={password}
                    onChange={changePassword}
                    className={style["input"]}
                    required
                />
                <input
                    type={viewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="새로운 비밀번호"
                    value={newPassword}
                    onChange={changeNewPassword}
                    className={`
                        ${style["input"]}
                        ${validPassword ? style["input-valid"] : style["input-invalid"]}
                    `}
                    required
                />
                {
                    !validPassword ?
                    <span className={`${style["input-invalid-message"]} ${colorStyle["red-font"]}`}>
                        * 비밀번호는 영문과 숫자를 포함한 8~16자리입니다.
                    </span> :
                    ""
                }
                <input
                    type={viewPassword ? "text" : "password"}
                    name="checkNewPassword"
                    placeholder="새로운 비밀번호 확인"
                    value={checkNewPassword}
                    onChange={changeCheckNewPassword}
                    className={`
                        ${style["input"]}
                        ${equalPassword ? style["input-valid"] : style["input-invalid"]}
                    `}
                    required
                />
                {
                    !equalPassword ?
                    <span className={`${style["input-invalid-message"]} ${colorStyle["red-font"]}`}>
                        * 비밀번호가 일치하지 않습니다.
                    </span> :
                    ""
                }
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
                <div id={style["errorMessage"]} className={colorStyle["red-font"]}>
                    {errorMessage}
                </div>
                {
                    validPassword && equalPassword ?
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
                비밀번호가 성공적으로 변경되었습니다.
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

export default UpdatePassword;