import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import BackgroundMusicPlayer from './component/BackgroundMusicPlayer';
import Header from './component/Header';
import Footer from './component/Footer';
import SoundContext from "./context/SoundContext.js";

import HomePage from './page/HomePage';
import MyPage from './page/MyPage';
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
import style from './App.module.css';
import homeBackgroundMusic from './sound/home_background_music.mp3';

function App() {

    const TIMEOUT = 70;                 // 화면 전환 시간
    const location = useLocation();     // 현재 위치

    // context
    const [isPlayMusic, setIsPlayMusic] = useState(true);                   // 배경음악 재생 여부
    const [isPlaySound, setIsPlaySound] = useState(true);                   // 효과음 재생 여부
    const [currentMusic, setCurrentMusic] = useState(homeBackgroundMusic);  // 배경음악 종류
    const [currentMusicVolume, setCurrentMusicVolume] = useState(1);        // 배경음악 크기

    return (
        <SoundContext.Provider value={{ isPlayMusic, setIsPlayMusic, isPlaySound, setIsPlaySound, currentMusic, setCurrentMusic, currentMusicVolume, setCurrentMusicVolume }}>
            <BackgroundMusicPlayer />
            <Header />
            <div style={{ "min-height": "100vh", "position": "relative" }}>
                <TransitionGroup>
                    <CSSTransition key={location.pathname} timeout={TIMEOUT} classNames={{
                        enter: style["fade-enter"],
                        enterActive: style["fade-enter-active"],
                        exit: style["fade-exit"],
                        exitActive: style["fade-exit-active"],
                    }} >
                        {state => (
                            <div>
                                <Routes location={location}>
                                    <Route path="/" element={<HomePage />}></Route>
                                    <Route path="/login" element={<LoginPage />}></Route>
                                    <Route path="/join" element={<JoinPage />} ></Route>
                                    <Route path="/reset-password" element={<ResetPasswordPage />}></Route>
                                    <Route path="/myPage" element={<MyPage />}></Route>
                                    <Route path="/game/red" element={<RedGamePage />}></Route>
                                    <Route path="/game/orange" element={<OrangeGamePage />}></Route>
                                    <Route path="/game/yellow" element={<YellowGamePage />}></Route>
                                    <Route path="/game/green" element={<GreenGamePage />}></Route>
                                    <Route path="/game/skyblue" element={<SkyblueGamePage />}></Route>
                                    <Route path="/game/blue" element={<BlueGamePage />}></Route>
                                    <Route path="/game/purple" element={<PurpleGamePage />}></Route>
                                    <Route path="/game/pink" element={<PinkGamePage />}></Route>
                                    <Route path="/game/black" element={<BlackGamePage />}></Route>
                                </Routes>
                            </div>
                        )}
                    </CSSTransition>
                </TransitionGroup>
            </div>
            <Footer />
        </SoundContext.Provider>
    );
}

export default App;