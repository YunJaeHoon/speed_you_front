import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { sendApi } from './util/apiUtil.js';

import BackgroundMusicPlayer from './component/BackgroundMusicPlayer';
import Header from './component/Header';
import Footer from './component/Footer';
import SoundContext from "./context/SoundContext.js";
import LoginContext from "./context/LoginContext.js";
import ThemeContext from "./context/ThemeContext.js";

import HomePage from './page/HomePage';
import LoginPage from './page/login/LoginPage';
import JoinPage from './page/login/JoinPage';
import ResetPasswordPage from './page/login/ResetPasswordPage';
import RedGamePage from './page/game/RedGamePage';
import OrangeGamePage from './page/game/OrangeGamePage';
import YellowGamePage from './page/game/YellowGamePage';
import GreenGamePage from './page/game/GreenGamePage';
import SkyblueGamePage from './page/game/SkyblueGamePage';
import BlueGamePage from './page/game/BlueGamePage';
import PurpleGamePage from './page/game/PurpleGamePage';
import PinkGamePage from './page/game/PinkGamePage';
import BlackGamePage from './page/game/BlackGamePage';
import RankPage from './page/rank/RankPage.js';
import SuggestionPage from './page/suggestion/SuggestionPage.js';
import MyPage from './page/mypage/MyPage.js';
import UpdateInfo from './page/mypage/UpdateInfo.js';
import UpdatePassword from './page/mypage/UpdatePassword.js';

import style from './App.module.css';
import colorStyle from './style/Color.module.css';
import homeBackgroundMusic from './sound/home_background_music.mp3';

function App() {

    const TIMEOUT = 150;                // 화면 전환 시간
    const location = useLocation();     // 현재 위치

    // context
    const [role, setRole] = useState(null);                                 // 계정 권한
    const [isPlayMusic, setIsPlayMusic] = useState(true);                   // 배경음악 재생 여부
    const [isPlaySound, setIsPlaySound] = useState(true);                   // 효과음 재생 여부
    const [currentMusic, setCurrentMusic] = useState(homeBackgroundMusic);  // 배경음악 종류
    const [currentMusicVolume, setCurrentMusicVolume] = useState(1);        // 배경음악 크기
    const [theme, setTheme] = useState("LIGHT");                            // 색 테마

    // 마운트 시에 실행
    useEffect(() => {

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
                setRole(null);
            }
        };

        getRole();

    }, []);

    // 특정 경로에서는 body의 overflow 속성을 변경
    useEffect(() => {

        if (location.pathname === '/' || location.pathname === '/mypage') {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'hidden';
        };

    }, [location.pathname]);

    return (
        <div id={style["background"]} className={theme === "LIGHT" ? colorStyle["white-background"] : colorStyle["black-background"]}>
            <LoginContext.Provider value={{ role, setRole }}>
                <ThemeContext.Provider value={{ theme, setTheme }}>
                    <SoundContext.Provider value={{ isPlayMusic, setIsPlayMusic, isPlaySound, setIsPlaySound, currentMusic, setCurrentMusic, currentMusicVolume, setCurrentMusicVolume }}>
                        <BackgroundMusicPlayer />
                        <Header />
                        <TransitionGroup>
                            <CSSTransition key={location.pathname} timeout={TIMEOUT} classNames={{
                                enter: style["fade-enter"],
                                enterActive: style["fade-enter-active"],
                                exit: style["fade-exit"],
                                exitActive: style["fade-exit-active"],
                            }}>
                                <Routes location={location}>
                                    <Route path="/" element={<HomePage />}></Route>
                                    <Route path="/login" element={<LoginPage />}></Route>
                                    <Route path="/join" element={<JoinPage />} ></Route>
                                    <Route path="/reset-password" element={<ResetPasswordPage />}></Route>
                                    <Route path="/game/red" element={<RedGamePage />}></Route>
                                    <Route path="/game/orange" element={<OrangeGamePage />}></Route>
                                    <Route path="/game/yellow" element={<YellowGamePage />}></Route>
                                    <Route path="/game/green" element={<GreenGamePage />}></Route>
                                    <Route path="/game/skyblue" element={<SkyblueGamePage />}></Route>
                                    <Route path="/game/blue" element={<BlueGamePage />}></Route>
                                    <Route path="/game/purple" element={<PurpleGamePage />}></Route>
                                    <Route path="/game/pink" element={<PinkGamePage />}></Route>
                                    <Route path="/game/black" element={<BlackGamePage />}></Route>
                                    <Route path="/rank" element={<RankPage />}></Route>
                                    <Route path="/suggestion" element={<SuggestionPage />}></Route>
                                    <Route path="/mypage" element={<MyPage />}></Route>
                                    <Route path="/myPage/update-info" element={<UpdateInfo />}></Route>
                                    <Route path="/myPage/update-password" element={<UpdatePassword />}></Route>
                                </Routes>
                            </CSSTransition>
                        </TransitionGroup>
                        {
                            !location.pathname.startsWith('/game') &&
                            <Footer isExistScrollbar={location.pathname === '/' || location.pathname === '/mypage' ? true : false} />
                        }
                    </SoundContext.Provider>
                </ThemeContext.Provider>
            </LoginContext.Provider>
        </div>
    );
}

export default App;