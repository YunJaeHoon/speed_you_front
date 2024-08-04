import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendApi } from '../../util/apiUtil.js';
import axios from 'axios';

import GameSelectButton from '../../component/GameSelectButton.js';
import WaitServer from '../../component/WaitServer.js';

import SoundContext from "../../context/SoundContext.js";
import LoginContext from "../../context/LoginContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './MyPageStyle.module.css';
import colorStyle from '../../style/Color.module.css';

import lightEditIcon from '../../image/edit-icon-light.svg';
import darkEditIcon from '../../image/edit-icon-dark.svg';
import lightCircleIcon from '../../image/circle-icon-light.svg';
import darkCircleIcon from '../../image/circle-icon-dark.svg';
import redIcon from '../../image/red-icon.svg';
import orangeIcon from '../../image/orange-icon.svg';
import yellowIcon from '../../image/yellow-icon.svg';
import greenIcon from '../../image/green-icon.svg';
import skyblueIcon from '../../image/skyblue-icon.svg';
import blueIcon from '../../image/blue-icon.svg';
import purpleIcon from '../../image/purple-icon.svg';
import pinkIcon from '../../image/pink-icon.svg';
import blackIcon from '../../image/black-icon.svg';
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

function MyPage() {

    const navigate = useNavigate();
    const gameList = ["Red", "Orange", "Yellow", "Green", "Skyblue", "Blue", "Purple", "Pink", "Black", "All"]
    const iconList = [redIcon, orangeIcon, yellowIcon, greenIcon, skyblueIcon, blueIcon, purpleIcon, pinkIcon, blackIcon]

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { setRole } = useContext(LoginContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [profileData, setProfileData] = useState(null);               // 프로필 데이터
    const [highestData, setHighestData] = useState(null);               // 최고 기록 데이터
    const [highestGame, setHighestGame] = useState(0);                  // 최고 기록 게임 인덱스
    const [historyData, setHistoryData] = useState(null);               // 전적 데이터
    const [historyCount, setHistoryCount] = useState(null);             // 전적 개수
    const [historyGame, setHistoryGame] = useState(9);                  // 전적 게임 인덱스
    const [historyOrder, setHistoryOrder] = useState("NEWEST");         // 전적 정렬 기준
    const [historyPage, setHistoryPage] = useState(1)                   // 전적 현재 페이지

    const [loadInitialData, setLoadInitialData] = useState(false)       // 초기 데이터 응답 여부
    const [loadHistoryData, setLoadHistoryData] = useState(false)       // 전적 데이터 응답 여부

    // 페이지 마운트 시, 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }
        
        // 프로필 데이터, 최고 기록 데이터, 전적 개수, 모든 게임 전적(최신순) 데이터 요청
        const getData = async () => {
            
            let isError = false;
            let [profile_data, highest_data, history_count, history_data] = [null, null, null, null];
            
            try {

                [profile_data, highest_data, history_count] = await Promise.all([
                    sendApi('/api/mypage/info', "GET", true, null),
                    sendApi('/api/mypage/highest-score', "GET", true, null),
                    sendApi('/api/mypage/history/count', "GET", true, { "game": gameList[historyGame] }),
                ]);

                if(history_count > 0) {
                    history_data = await sendApi('/api/mypage/history', "GET", true, {
                        "game": gameList[historyGame],
                        "order": historyOrder,
                        "page": 1
                    });
                }

            } catch (error) {
                isError = true;

                if(error.response?.data?.code === "UNAUTHORIZED") {
                    window.alert("로그인이 필요합니다.");
                    setRole(null);
                    navigate('/login');
                }
            }

            setProfileData(profile_data);
            setHighestData(highest_data);
            setHistoryCount(history_count);
            setHistoryData(history_data);
        
            if(!isError) { setLoadInitialData(true) };
        };

        getData();

    }, []);

    // 로그아웃 함수
    const logout = async () => {
        try {
            await sendApi('/api/logout', "POST", true, null);
        }
        catch {}
        finally {
            delete axios.defaults.headers.common['Authorization'];
            window.localStorage.removeItem("accessToken");
            window.localStorage.removeItem("refreshToken");

            setRole(null);
            navigate('/');
        }
    }

    // 전적 게임 변경 시, 호출 함수
    const handleGameChange = async (event) => {

        setLoadHistoryData(false);

        try
        {
            let history_count = await sendApi('/api/mypage/history/count', "GET", true, {"game": gameList[event.target.value] });
            let history_data = null;

            if(history_count > 0) {
                history_data = await sendApi('/api/mypage/history', "GET", true, {
                    "game": gameList[event.target.value],
                    "order": event.target.value == 9 && (historyOrder === "HIGHEST" || historyOrder === "LOWEST") ?
                        "NEWEST" :
                        historyOrder,
                    "page": 1
                });
            }

            setHistoryGame(event.target.value);
            setHistoryCount(history_count);
            setHistoryData(history_data);
            setHistoryPage(1);

            if(event.target.value == 9 && (historyOrder === "HIGHEST" || historyOrder === "LOWEST"))
                setHistoryOrder("NEWEST");

        } catch (error) {

            if(error.response?.data?.code === "UNAUTHORIZED") {
                window.alert("로그인이 필요합니다.");
                setRole(null);
                navigate('/login');
            }

        }

        setLoadHistoryData(true);
    };

    // 전적 정렬 기준 변경 시, 호출 함수
    const handleOrderChange = async (event) => {

        setLoadHistoryData(false);

        try
        {
            let history_count = await sendApi('/api/mypage/history/count', "GET", true, {"game": gameList[historyGame] });
            let history_data = null;

            if(history_count > 0) {
                history_data = await sendApi('/api/mypage/history', "GET", true, {
                    "game": gameList[historyGame],
                    "order": event.target.value,
                    "page": 1
                });
            }

            setHistoryOrder(event.target.value);
            setHistoryCount(history_count);
            setHistoryData(history_data);
            setHistoryPage(1);

        } catch (error) {
            console.log(error.response?.data?.message);
            window.alert("로그인이 필요합니다.");
            setRole(null);
            navigate('/login');
        }

        setLoadHistoryData(true);
    };

    // 첫 페이지로 이동
    const clickPrevDouble = () => {
        setHistoryPage(1);
    };

    // 마지막 페이지로 이동
    const clickNextDouble = () => {
        setHistoryPage(Math.floor(historyCount / 10) + 1);
    };

    // 이전 페이지로 이동
    const clickPrev = () => {
        if(historyPage > 1)
            setHistoryPage(historyPage - 1);
    };

    // 다음 페이지로 이동
    const clickNext = () => {
        if(historyPage < Math.floor(historyCount / 10) + 1)
            setHistoryPage(historyPage + 1);
    };

    // 페이지 변경 시, 실행
    useEffect(() => {

        setLoadHistoryData(false);
        
        const getData = async () => {
            
            let history_data = null;
            
            try {

                if(historyCount > 0 && historyPage > 0 && historyPage <= Math.floor(historyCount / 10) + 1) {
                    history_data = await sendApi('/api/mypage/history', "GET", true, {
                        "game": gameList[historyGame],
                        "order": historyOrder,
                        "page": historyPage
                    });
                }

            } catch (error) {
                if(error.response?.data?.code === "UNAUTHORIZED") {
                    window.alert("로그인이 필요합니다.");
                    setRole(null);
                    navigate('/login');
                }
            }

            setHistoryData(history_data);
        };

        getData();

        setLoadHistoryData(true);

    }, [historyPage]);

    return (
        <div>
            {
                loadInitialData ?
                <div id={style["container"]}>
                    <div
                        id={style["profile-container"]}
                        className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
                    >
                        <div id={style["profile-title"]}>
                            내 정보
                        </div>
                        <div
                            className={style["info-container"]}
                            style={theme === "LIGHT" ? {borderLeft: "0.4vh solid #20201E"} : {borderLeft: "0.4vh solid #FFFFFF"}}
                        >
                            <div className={style["info-subcontainer"]}>
                                <div className={style["info-title"]}>이메일</div>
                                <div className={style["info"]}>{profileData.email}</div>
                            </div>
                            <div className={style["info-subcontainer"]}>
                                <div className={style["info-title-container"]}>
                                    <span className={style["info-title"]}>닉네임</span>
                                    <Link to="/mypage/update-info" id={style["update-info-button"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                                        <img src={theme === "LIGHT" ? lightEditIcon : darkEditIcon} id={style["edit-icon"]} alt="수정 아이콘" />
                                    </Link>
                                </div>
                                <div className={style["info"]}>{profileData.username}</div>
                            </div>
                            <div className={style["info-subcontainer"]}>
                                <div className={style["info-title"]}>계정 생성 날짜</div>
                                <div className={style["info"]}>{profileData.created_at}</div>
                            </div>
                            <div className={style["info-subcontainer"]}>
                                <div className={style["info-title"]}>권한</div>
                                <div className={style["info"]}>{profileData.role === "ROLE_ADMIN" ? "관리자" : "일반 사용자"}</div>
                            </div>
                        </div>
                        <div id={style["update-password-container"]}>
                            <img src={theme === "LIGHT" ? lightCircleIcon : darkCircleIcon} id={style["circle-icon"]} alt="원 아이콘" />
                            <Link to="/mypage/update-password" id={style["update-password-button"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                                비밀번호 변경하기
                            </Link>
                        </div>
                        <div id={style["logout-container"]}>
                            <img src={theme === "LIGHT" ? lightCircleIcon : darkCircleIcon} id={style["circle-icon"]} alt="원 아이콘" />
                            <div id={style["logout-button"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]} onClick={logout}>
                                로그아웃
                            </div>
                        </div>
                    </div>
                    <div className={`${style["divider"]} ${theme === "LIGHT" ? colorStyle["black-background"] : colorStyle["white-background"]}`}></div>
                    <div
                        id={style["highest-container"]}
                        className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
                    >
                        <div id={style["highest-title"]}>
                            최고 기록
                            <div id={style["highest-select-container"]}>
                                {
                                    gameList.map((game, index) =>
                                        index !== 9 ?
                                        <GameSelectButton
                                            game={game}
                                            currentGame={gameList[highestGame]}
                                            background={game.toLowerCase() + "-background"}
                                            onClick={() => {setHighestGame(index)}}
                                        /> :
                                        ""
                                    )
                                }
                            </div>
                        </div>
                        {
                            highestData[highestGame].score !== null ?
                            <div
                                className={style["info-container"]}
                                style={theme === "LIGHT" ? {borderLeft: "0.4vh solid #20201E"} : {borderLeft: "0.4vh solid #FFFFFF"}}
                            >
                                <div className={style["highest-game-title-container"]}>
                                    <img
                                        src={iconList[highestGame]}
                                        className={style["highest-game-icon"]}
                                        alt="game-icon"
                                    />
                                    <span className={style["highest-game-title"]}>{highestData[highestGame].game} 최고 기록</span>
                                </div>
                                <div className={style["info-subcontainer"]}>
                                    <div className={style["info-title"]}>점수</div>
                                    <div className={style["info"]}>{highestData[highestGame].score}</div>
                                </div>
                                <div className={style["info-subcontainer"]}>
                                    <div className={style["info-title"]}>상위 퍼센트</div>
                                    <div className={style["info"]}>상위 {highestData[highestGame].percentile}%</div>
                                </div>
                                <div className={style["info-subcontainer"]}>
                                    <div className={style["info-title"]}>날짜 및 시간</div>
                                    <div className={style["info"]}>{highestData[highestGame]?.created_at?.split('T')[0] + ", " + highestData[highestGame]?.created_at?.split('.')[0]?.split('T')[1]}</div>
                                </div>
                            </div> :
                            <div
                                className={style["info-container"]}
                                style={theme === "LIGHT" ? {borderLeft: "0.4vh solid #20201E"} : {borderLeft: "0.4vh solid #FFFFFF"}}
                            >
                                <div className={style["highest-game-title-container"]}>
                                <img
                                    src={iconList[highestGame]}
                                    className={style["highest-game-icon"]}
                                    alt="game-icon"
                                />
                                    <span className={style["highest-game-title"]}>{highestData[highestGame].game} 최고 기록</span>
                                </div>
                                <div className={style["info-subcontainer"]}>
                                    해당 게임의 전적 검색 결과가 존재하지 않습니다.
                                </div>
                            </div>
                        }
                    </div>
                    <div className={`${style["divider"]} ${theme === "LIGHT" ? colorStyle["black-background"] : colorStyle["white-background"]}`}></div>
                    {
                        loadHistoryData ?
                        <div
                            id={style["history-container"]}
                            className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
                        >
                            <div id={style["history-title"]}>
                                게임 전적
                                <div id={style["history-select-container"]}>
                                    <select id={style["history-select-game"]} value={historyGame} name="game" onChange={handleGameChange}>
                                        <option value={9} className={style["history-select-option"]}>게임 전체</option>
                                        <option value={0} className={style["history-select-option"]}>Red</option>
                                        <option value={1} className={style["history-select-option"]}>Orange</option>
                                        <option value={2} className={style["history-select-option"]}>Yellow</option>
                                        <option value={3} className={style["history-select-option"]}>Green</option>
                                        <option value={4} className={style["history-select-option"]}>Skyblue</option>
                                        <option value={5} className={style["history-select-option"]}>Blue</option>
                                        <option value={6} className={style["history-select-option"]}>Purple</option>
                                        <option value={7} className={style["history-select-option"]}>Pink</option>
                                        <option value={8} className={style["history-select-option"]}>Black</option>
                                    </select>
                                    <select id={style["history-select-order"]} value={historyOrder} name="order" onChange={handleOrderChange}>
                                        <option value="NEWEST" className={style["history-select-option"]}>최신순</option>
                                        <option value="OLDEST" className={style["history-select-option"]}>오래된 순</option>
                                        {historyGame != 9 && <option value="HIGHEST" className={style["history-select-option"]}>점수 높은 순</option>}
                                        {historyGame != 9 && <option value="LOWEST" className={style["history-select-option"]}>점수 낮은 순</option>}
                                    </select>
                                </div>
                            </div>
                            <div id={style["history-description-container"]} style={theme === "LIGHT" ? {borderColor: "#20201E"} : {borderColor: "#FFFFFF"}}>
                                <span id={style["history-game-subcontainer"]} className={style["history-description"]}>
                                    게임
                                </span>
                                <span id={style["history-score-subcontainer"]} className={style["history-description"]}>
                                    점수
                                </span>
                                <span id={style["history-percentile-subcontainer"]} className={style["history-description"]}>
                                    상위 퍼센트
                                </span>
                                <span id={style["history-date-subcontainer"]} className={style["history-description"]}>
                                    등록 날짜
                                </span>
                            </div>
                            {
                                historyData !== null ?
                                historyData.map((data) =>
                                    <div id={style["history-data-container"]} style={theme === "LIGHT" ? {borderColor: "#20201E"} : {borderColor: "#FFFFFF"}}>
                                        <span id={style["history-game-subcontainer"]}>
                                            <span id={style["history-game-second-subcontainer"]}>
                                                <img
                                                    src={iconList[gameList.indexOf(data.game)]}
                                                    id={style["history-game-icon"]}
                                                    alt="game-icon"
                                                />
                                                <div className={style["history-name-data"]}>{data.game}</div>
                                            </span>
                                        </span>
                                        <span id={style["history-score-subcontainer"]}>
                                            <div className={style["history-score-data"]}>{data.score}</div>
                                        </span>
                                        <span id={style["history-percentile-subcontainer"]}>
                                            <div className={style["history-percentile-data"]}>{data.percentile}%</div>
                                        </span>
                                        <span id={style["history-date-subcontainer"]}>
                                            <div className={style["history-date-data"]}>{data.created_at?.split('T')[0] + ", " + data.created_at?.split('.')[0]?.split('T')[1]}</div>
                                        </span>
                                    </div>
                                ) :
                                <div className={style["history-error"]} style={theme === "LIGHT" ? {borderColor: "#20201E"} : {borderColor: "#FFFFFF"}}>
                                    해당 게임의 전적 검색 결과가 존재하지 않습니다.
                                </div>
                            }
                            <div id={style["page-container"]}>
                                <img
                                    src={
                                        historyPage === 1 ? greyPrevDoubleIcon :
                                        theme === "LIGHT" ? lightPrevDoubleIcon : darkPrevDoubleIcon
                                    }
                                    style={historyPage === 1 ? {cursor: "auto"} : {cursor: "pointer"}}
                                    className={style["page-icon"]}
                                    alt="first-page-icon"
                                    onClick={clickPrevDouble}
                                />
                                <img
                                    src={
                                        historyPage === 1 ? greyPrevIcon :
                                        theme === "LIGHT" ? lightPrevIcon : darkPrevIcon
                                    }
                                    style={historyPage === 1 ? {cursor: "auto"} : {cursor: "pointer"}}
                                    className={style["page-icon"]}
                                    alt="prev-page-icon"
                                    onClick={clickPrev}
                                />
                                <span id={style["page-number"]}>
                                    {historyPage}
                                </span>
                                <img
                                    src={
                                        historyPage === Math.floor(historyCount / 10) + 1 ? greyNextIcon :
                                        theme === "LIGHT" ? lightNextIcon : darkNextIcon
                                    }
                                    style={historyPage === Math.floor(historyCount / 10) + 1 ? {cursor: "auto"} : {cursor: "pointer"}}
                                    className={style["page-icon"]}
                                    alt="next-page-icon"
                                    onClick={clickNext}
                                />
                                <img
                                    src={
                                        historyPage === Math.floor(historyCount / 10) + 1 ? greyNextDoubleIcon :
                                        theme === "LIGHT" ? lightNextDoubleIcon : darkNextDoubleIcon
                                    }
                                    style={historyPage === Math.floor(historyCount / 10) + 1 ? {cursor: "auto"} : {cursor: "pointer"}}
                                    className={style["page-icon"]}
                                    alt="last-page-icon"
                                    onClick={clickNextDouble}
                                />
                            </div>
                        </div> :
                        <div
                            id={style["history-container"]}
                            className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
                        >
                            <div id={style["history-title"]}>
                                게임 전적
                            </div>
                            <div id={style["wait-container"]}>
                                <WaitServer />
                            </div>
                        </div>
                    }
                </div> :
                <div id={style["wait-container"]}>
                    <WaitServer />
                </div>
            }
        </div>
    );
}

export default MyPage;