import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

import Icon from './Icon';
import SoundContext from "../context/SoundContext.js";

import style from '../style/component_style/HeaderStyle.module.css';
import logo from '../image/logo.svg';
import profileIcon from '../image/profile-icon.svg';
import rankingIcon from '../image/ranking-icon.svg';
import suggestionIcon from '../image/suggestion-icon.svg';
import announcementIcon from '../image/announcement-icon.svg';
import musicIcon from '../image/music-icon.svg';
import musicMuteIcon from '../image/music-mute-icon.svg';
import soundIcon from '../image/sound-icon.svg';
import soundMuteIcon from '../image/sound-mute-icon.svg';

function Header() {

    // context
    const { isPlayMusic, setIsPlayMusic, isPlaySound, setIsPlaySound } = useContext(SoundContext);

    const location = useLocation();     // 현재 위치

    // state
    const [isLogin, setIsLogin] = useState(false);  // 로그인 여부

    // 마운트 시에 실행
    useEffect(() => {

        // 로그인 여부 확인
        axios.get('/api/is-login', null)
            .then((response) => {
                setIsLogin(response.data.data.toLowerCase() === "true");
            }).catch((error) => {
                setIsLogin(false);
            });

    }, [location]);

    return (
        <div id={style["container"]}>
            <div id={style["left-container"]}>
                <Link to="/" id={style["logo-container"]}>
                    <img src={logo} id={style["logo"]} alt="Speed.you logo" />
                </Link>
                <Icon name="랭킹" link="/" alt="ranking-icon" source={rankingIcon} direction="left" />
                <Icon name="건의사항" link="/" alt="suggestion-icon" source={suggestionIcon} direction="left" />
                <Icon name="공지사항" link="/" alt="announcement-icon" source={announcementIcon} direction="left" />
                <div className={style["divider"]}></div>
                <div className={style["icon-link"]} onClick={() => setIsPlayMusic(!isPlayMusic)}>
                    <img src={isPlayMusic ? musicIcon : musicMuteIcon} className={style["icon"]} alt="music-icon" />
                    <div className={style["icon-description"]}>
                        {isPlayMusic ? "배경음 끄기" : "배경음 켜기"}
                    </div>
                </div>
                <div className={style["icon-link"]} onClick={() => setIsPlaySound(!isPlaySound)}>
                    <img src={isPlaySound ? soundIcon : soundMuteIcon} className={style["icon"]} alt="sound-icon" />
                    <div className={style["icon-description"]}>
                        {isPlaySound ? "효과음 끄기" : "효과음 켜기"}
                    </div>
                </div>
            </div>
            <div id={style["right-container"]}>
                <Icon
                    name={isLogin ? "마이페이지" : "로그인"}
                    link={isLogin ? "/myPage" : "/login"}
                    alt="profile-icon"
                    source={profileIcon}
                    direction="right"
                />
                <div id={style["game-list"]}>
                    <div>GAME</div>
                    <Link to="/game/red" style={{ "background-color": "#FF1F00" }} className={style["game-button"]}></Link>
                    <Link to="/game/orange" style={{ "background-color": "#FF7900" }} className={style["game-button"]}></Link>
                    <Link to="/game/yellow" style={{ "background-color": "#FFC700" }} className={style["game-button"]}></Link>
                    <Link to="/game/green" style={{ "background-color": "#20CC20" }} className={style["game-button"]}></Link>
                    <Link to="/game/skyblue" style={{ "background-color": "#43C9FF" }} className={style["game-button"]}></Link>
                    <Link to="/game/blue" style={{ "background-color": "#0075FF" }} className={style["game-button"]}></Link>
                    <Link to="/game/purple" style={{ "background-color": "#C465FF" }} className={style["game-button"]}></Link>
                    <Link to="/game/pink" style={{ "background-color": "#FF7596" }} className={style["game-button"]}></Link>
                    <Link to="/game/black" style={{ "background-color": "#20201E" }} className={style["game-button"]}></Link>
                </div>
            </div>
        </div>
    );
}

export default Header;