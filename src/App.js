import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Footer from './component/Footer';

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

function App() {

    const TIMEOUT = 70;                 // 화면 전환 시간
    const location = useLocation();     // 현재 위치

    return (
        <div>
            <div style={{ "min-height": "100vh", "position": "relative", "z-index": "1" }}>
                <TransitionGroup>
                    <CSSTransition key={ location.pathname } timeout={ TIMEOUT } classNames={{
                        enter: style["fade-enter"],
                        enterActive: style["fade-enter-active"],
                        exit: style["fade-exit"],
                        exitActive: style["fade-exit-active"],
                    }} >
                        {state => (
                            <div>
                                <Routes location={ location }>
                                    <Route path="/" element={ <HomePage /> }></Route>
                                    <Route path="/login" element={ <LoginPage /> }></Route>
                                    <Route path="/join" element={ <JoinPage />} ></Route>
                                    <Route path="/reset-password" element={ <ResetPasswordPage /> }></Route>
                                    <Route path="/myPage" element={ <MyPage /> }></Route>
                                    <Route path="/game/red" element={ <RedGamePage /> }></Route>
                                    <Route path="/game/orange" element={ <OrangeGamePage /> }></Route>
                                    <Route path="/game/yellow" element={ <YellowGamePage /> }></Route>
                                    <Route path="/game/green" element={ <GreenGamePage /> }></Route>
                                    <Route path="/game/skyblue" element={ <SkyblueGamePage /> }></Route>
                                    <Route path="/game/blue" element={ <BlueGamePage /> }></Route>
                                    <Route path="/game/purple" element={ <PurpleGamePage /> }></Route>
                                    <Route path="/game/pink" element={ <PinkGamePage /> }></Route>
                                    <Route path="/game/black" element={ <BlackGamePage /> }></Route>
                                </Routes>
                            </div>
                        )}
                    </CSSTransition>
                </TransitionGroup>
            </div>
            <Footer />
        </div>
    );
}

export default App;