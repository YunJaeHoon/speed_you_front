import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendApi } from '../../util/apiUtil.js';

import WaitServer from '../../component/WaitServer.js';

import SoundContext from "../../context/SoundContext.js";
import LoginContext from "../../context/LoginContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './SuggestionStyle.module.css';
import colorStyle from '../../style/Color.module.css';

import lightPrevIcon from '../../image/prev-icon-light.svg';
import darkPrevIcon from '../../image/prev-icon-dark.svg';
import greyPrevIcon from '../../image/prev-icon-grey.svg';
import lightNextIcon from '../../image/next-icon-light.svg';
import darkNextIcon from '../../image/next-icon-dark.svg';
import greyNextIcon from '../../image/next-icon-grey.svg';
import lightPrevDoubleIcon from '../../image/prev-double-icon-light.svg';
import darkPrevDoubleIcon from '../../image/prev-double-icon-dark.svg';
import greyPrevDoubleIcon from '../../image/prev-double-icon-grey.svg';
import lightNextDoubleIcon from '../../image/next-double-icon-light.svg';
import darkNextDoubleIcon from '../../image/next-double-icon-dark.svg';
import greyNextDoubleIcon from '../../image/next-double-icon-grey.svg';

import homeBackgroundMusic from '../../sound/home_background_music.mp3';

function SuggestionPage() {

    let content = null;
    const navigate = useNavigate();
    const backgrounds = ["red-background", "orange-background", "yellow-background", "green-background", "skyblue-background", "blue-background", "purple-background", "pink-background"];

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { role, setRole } = useContext(LoginContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [mainColor, setMainColor] = useState(0);                  // 메인 색상 index

    const [suggestionType, setSuggestionType] = useState(null);     // 건의사항 종류
    const [detail, setDetail] = useState("");                       // 건의사항 내용
    const [detailLength, setDetailLength] = useState(0)             // 건의사항 내용 글자 수
    const [errorMessage, setErrorMessage] = useState("");           // 에러 메시지

    const [suggestionCount, setSuggestionCount] = useState(0);          // 건의사항 개수
    const [suggestionBasic, setSuggestionBasic] = useState(null);       // 건의사항 간단 조회 데이터
    const [suggestionDetail, setSuggestionDetail] = useState(null);     // 건의사항 상세 조회 데이터
    const [loadingBasic, setLoadingBasic] = useState(true);             // 건의사항 간단 조회 데이터 요청 중 여부
    const [loadingDetail, setLoadingDetail] = useState(true);           // 건의사항 상세 조회 데이터 요청 중 여부
    const [page, setPage] = useState(1);                                // 건의사항 목록 페이지
    const [isShowDetail, setIsShowDetail] = useState(false);            // 건의사항 상세 정보 출력 여부

    // 마운트 시에 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        // 메인 색상 index 결정
        setMainColor(Math.floor(Math.random() * backgrounds.length));

        // 권한 확인
        const getRole = async () => {
            try {
                const response = await sendApi(
                    '/api/get-role',
                    "GET",
                    true,
                    null
                );

                setRole(response);
            } catch (error) {
                if(error.response?.data?.code === "UNAUTHORIZED") {
                    window.alert("로그인이 필요합니다.");
                    setRole(null);
                    navigate('/login');
                }
            }
        };

        getRole();

    }, []);

    // 건의사항 간단 조회
    useEffect(() => {

        const getBasic = async () => {

            if(role === "ROLE_ADMIN" && page >= 1 ) {

                let [suggestion_count, suggestion_basic] = [null, null];

                try {

                    suggestion_count = await sendApi('/api/suggestion/count', "GET", true, null);

                    if(suggestion_count > 0) {
                        suggestion_basic = await sendApi('/api/suggestion/basic', "GET", true, { "page": page });
                    }

                    setSuggestionCount(suggestion_count);
                    setSuggestionBasic(suggestion_basic);
                    setLoadingBasic(false);

                } catch (error) {
                    if(error.response?.data?.code === "UNAUTHORIZED") {
                        window.alert("로그인이 필요합니다.");
                        setRole(null);
                        navigate('/login');
                    }
                    else if(error.response?.data?.code === "LOW_AUTHORITY") {
                        window.alert("관리자 계정 로그인이 필요합니다.");
                        navigate('/login');
                    }
                }
            }

        };

        setLoadingBasic(true);
        getBasic();

    }, [role, page]);

    // 건의사항 종류: 버그 신고 선택
    function selectBugReport() {
        if(suggestionType === "BUG_REPORT")
            setSuggestionType(null);
        else
            setSuggestionType("BUG_REPORT");
    }

    // 건의사항 종류: 문의 선택
    function selectInquiry() {
        if(suggestionType === "INQUIRY")
            setSuggestionType(null);
        else
            setSuggestionType("INQUIRY");
    }

    // 건의사항 종류: 신규 기능 제안 선택
    function selectAdvice() {
        if(suggestionType === "ADVICE")
            setSuggestionType(null);
        else
            setSuggestionType("ADVICE");
    }

    // 건의사항 내용 입력 시마다 실행
    function changeDetail(e) {
        setDetail(e.target.value);
        setDetailLength(e.target.value.length);
    }

    // 건의사항 등록
    const insertSuggestion = async () => {

        await setErrorMessage("");

        if(suggestionType === null) {
            setErrorMessage("건의사항 종류를 선택해야 합니다.");
        }
        else if(detailLength > 1000) {
            setErrorMessage("건의사항 내용의 글자 수는 1000자까지 가능합니다.");
        }
        else {
            try {
                await sendApi(
                    '/api/suggestion/insert-suggestion',
                    "POST",
                    true,
                    {
                        "type": suggestionType,
                        "detail": detail
                    }
                );

                window.alert("건의사항 등록을 완료하였습니다.");
                navigate('/');
            } catch (error) {
                if(error.response?.data?.code === "UNAUTHORIZED") {
                    window.alert("로그인이 필요합니다.");
                    setRole(null);
                    navigate('/login');
                }
                else if(error.response?.data?.code === "TOO_LONG_DETAIL") {
                    setErrorMessage("건의사항 내용의 글자 수는 1000자까지 가능합니다.");
                }
                else if(error.response?.data?.code === "TOO_MANY_SUGGESTIONS") {
                    setErrorMessage("건의사항은 하루에 최대 10개씩 등록 가능합니다.");
                }
                else {
                    setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
                }
            }
        }
    }

    // 첫 페이지로 이동
    const clickPrevDouble = () => {
        setPage(1);
    };

    // 마지막 페이지로 이동
    const clickNextDouble = () => {
        setPage(Math.floor(suggestionCount / 10) + 1);
    };

    // 이전 페이지로 이동
    const clickPrev = () => {
        if(page > 1)
            setPage(page - 1);
    };

    // 다음 페이지로 이동
    const clickNext = () => {
        if(page < Math.floor(suggestionCount / 10) + 1)
            setPage(page + 1);
    };

    // 건의사항 상세 조회
    const showDetail = async (suggestion_id) => {

        setLoadingDetail(true);
        setIsShowDetail(true);

        try {

            const response = await sendApi(
                '/api/suggestion/detail',
                "GET",
                true,
                {
                    "suggestion_id": suggestion_id
                }
            );

            setSuggestionDetail(response);

        } catch (error) {
            setSuggestionDetail(null);
        } finally {
            setLoadingDetail(false);
        }
    }

    if(role === "ROLE_USER")
    {
        content = <div id={style["container"]}>
            <div
                id={style["title"]}
                className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
            >
                건의사항
            </div>
            <div id={style["checkbox-container"]}>
                <div className={style["checkbox-subcontainer"]} onClick={selectBugReport}>
                    <span
                        className={`
                            ${style["checkbox"]}
                            ${
                                suggestionType === "BUG_REPORT" ? colorStyle[backgrounds[mainColor]] :
                                theme === "LIGHT" ? colorStyle["white-background"] : colorStyle["black-background"]
                            }
                        `}
                        style={theme === "LIGHT" ? {border: "0.25vh solid #20201E"} : {border: "0.25vh solid #FFFFFF"}}
                    >
                    </span>
                    <span
                        className={`
                            ${style["checkbox-description"]}
                            ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
                        `}
                    >
                        버그 신고
                    </span>
                </div>
                <div className={style["checkbox-subcontainer"]} onClick={selectInquiry}>
                    <span
                        className={`
                            ${style["checkbox"]}
                            ${
                                suggestionType === "INQUIRY" ? colorStyle[backgrounds[mainColor]] :
                                theme === "LIGHT" ? colorStyle["white-background"] : colorStyle["black-background"]
                            }
                        `}
                        style={theme === "LIGHT" ? {border: "0.25vh solid #20201E"} : {border: "0.25vh solid #FFFFFF"}}
                    >
                    </span>
                    <span
                        className={`
                            ${style["checkbox-description"]}
                            ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
                        `}
                    >
                        문의
                    </span>
                </div>
                <div className={style["checkbox-subcontainer"]} onClick={selectAdvice}>
                    <span
                        className={`
                            ${style["checkbox"]}
                            ${
                                suggestionType === "ADVICE" ? colorStyle[backgrounds[mainColor]] :
                                theme === "LIGHT" ? colorStyle["white-background"] : colorStyle["black-background"]
                            }
                        `}
                        style={theme === "LIGHT" ? {border: "0.25vh solid #20201E"} : {border: "0.25vh solid #FFFFFF"}}
                    >
                    </span>
                    <span
                        className={`
                            ${style["checkbox-description"]}
                            ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
                        `}
                    >
                        신규 기능 제안
                    </span>
                </div>
            </div>
            <textarea
                id={style["detail"]}
                className={theme === "LIGHT" ? colorStyle["white-background"] : colorStyle["black-background"]}
                style={
                    theme === "LIGHT" ?
                    {border: "0.25vh solid #20201E", color: "#20201E"} :
                    {border: "0.25vh solid #FFFFFF", color: "#FFFFFF"}
                }
                onChange={changeDetail}
                placeholder="글자 수는 1000자까지 가능합니다."
            />
            <div
                id={style["detail-length"]}
                className={
                    detailLength > 1000 ? colorStyle["red-font"] :
                    theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]
                }
            >
                {detailLength} / 1000
            </div>
            <div id={style["error-message"]} className={colorStyle["red-font"]}>
                {errorMessage}
            </div>
            <div
                id={style["submit-button"]}
                className={`
                    ${colorStyle[backgrounds[mainColor]]}
                    ${colorStyle["white-font"]}
                `}
                onClick={insertSuggestion}
            >
                확인
            </div>
        </div>
    }
    else if(role === "ROLE_ADMIN")
    {
        content = <div id={style["container"]}>
            <div
                id={style["title"]}
                className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
            >
                건의사항
            </div>
            {
                loadingBasic === false ?
                <div id={style["basic-container"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                    {
                        suggestionBasic !== null ?
                        suggestionBasic.map((data) =>
                            <div
                                className={style["basic-subcontainer"]}
                                style={theme === "LIGHT" ? {borderColor: "#20201E"} : {borderColor: "#FFFFFF"}}
                                onClick={() => showDetail(data.suggestion_id)}
                            >
                                <span className={style["basic-type-container"]}>{data.type}</span>
                                <span className={style["basic-email-container"]}>{data.email}</span>
                                <span className={style["basic-username-container"]}>{data.username}</span>
                                <span className={style["basic-created_at-container"]}>{data.created_at}</span>
                            </div>
                        ) :
                        <div id={style["suggestion-error"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                            건의사항이 존재하지 않습니다.
                        </div>
                    }
                    <div id={style["page-container"]}>
                        <img
                            src={
                                page === 1 ? greyPrevDoubleIcon :
                                theme === "LIGHT" ? lightPrevDoubleIcon : darkPrevDoubleIcon
                            }
                            style={page === 1 ? {cursor: "auto"} : {cursor: "pointer"}}
                            className={style["page-icon"]}
                            alt="first-page-icon"
                            onClick={clickPrevDouble}
                        />
                        <img
                            src={
                                page === 1 ? greyPrevIcon :
                                theme === "LIGHT" ? lightPrevIcon : darkPrevIcon
                            }
                            style={page === 1 ? {cursor: "auto"} : {cursor: "pointer"}}
                            className={style["page-icon"]}
                            alt="prev-page-icon"
                            onClick={clickPrev}
                        />
                        <span id={style["page-number"]}>
                            {page}
                        </span>
                        <img
                            src={
                                page === Math.floor(suggestionCount / 10) + 1 ? greyNextIcon :
                                theme === "LIGHT" ? lightNextIcon : darkNextIcon
                            }
                            style={page === Math.floor(suggestionCount / 10) + 1 ? {cursor: "auto"} : {cursor: "pointer"}}
                            className={style["page-icon"]}
                            alt="next-page-icon"
                            onClick={clickNext}
                        />
                        <img
                            src={
                                page === Math.floor(suggestionCount / 10) + 1 ? greyNextDoubleIcon :
                                theme === "LIGHT" ? lightNextDoubleIcon : darkNextDoubleIcon
                            }
                            style={page === Math.floor(suggestionCount / 10) + 1 ? {cursor: "auto"} : {cursor: "pointer"}}
                            className={style["page-icon"]}
                            alt="last-page-icon"
                            onClick={clickNextDouble}
                        />
                    </div>
                    {
                        isShowDetail ?
                        <div
                            id={style["detail-container"]}
                            className={theme === "LIGHT" ? colorStyle["white-background"] : colorStyle["black-background"]}
                            style={theme === "LIGHT" ? {borderColor: "#20201E"} : {borderColor: "#FFFFFF"}}
                            onClick={() => {setIsShowDetail(false)}}
                        >
                            {
                                loadingDetail ? <WaitServer /> :
                                suggestionDetail !== null ?
                                <div id={style["detail-subcontainer"]}>
                                    <div id={style["detail-basic-container"]}>
                                        <span className={style["basic-type-container"]}>{suggestionDetail.type}</span>
                                        <span className={style["basic-email-container"]}>{suggestionDetail.email}</span>
                                        <span className={style["basic-username-container"]}>{suggestionDetail.username}</span>
                                        <span className={style["basic-created_at-container"]}>{suggestionDetail.created_at}</span>
                                    </div>
                                    <div id={style["detail-detail-container"]}>
                                        {suggestionDetail.detail}
                                    </div>
                                </div> :
                                <div id={style["suggestion-error"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                                    오류가 발생하였습니다.
                                </div>
                            }
                        </div> :
                        <div></div>
                    }
                </div> :
                <WaitServer />
            }
        </div>
    }

    return (
        <div id={style["background"]}>
            {content}
        </div>
    );
}

export default SuggestionPage;