import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Icon from './Icon';
import SoundContext from "../context/SoundContext.js";
import LoginContext from "../context/LoginContext.js";

import style from './HeaderStyle.module.css';
import iconStyle from './IconStyle.module.css';
import colorStyle from '../style/Color.module.css';

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
    const { role } = useContext(LoginContext);

    return (
        <div id={style["background"]}>
            <div id={style["left-container"]}>
                <Link to="/">
                    <img src={logo} id={style["logo"]} alt="Speed.you logo" />
                </Link>
                <Icon name="랭킹" link="/" alt="ranking-icon" source={rankingIcon} direction="left" />
                <Icon name="건의사항" link="/" alt="suggestion-icon" source={suggestionIcon} direction="left" />
                <Icon name="공지사항" link="/" alt="announcement-icon" source={announcementIcon} direction="left" />
                <div className={style["divider"]}></div>
                <div className={`${iconStyle["icon-link"]} ${iconStyle["icon-link-left"]}`} onClick={() => setIsPlayMusic(!isPlayMusic)}>
                    <img src={isPlayMusic ? musicIcon : musicMuteIcon} className={iconStyle["icon"]} alt="music-icon" />
                    <div className={`${iconStyle["icon-description"]} ${colorStyle["black-font"]}`}>
                        {isPlayMusic ? "배경음 끄기" : "배경음 켜기"}
                    </div>
                </div>
                <div className={`${iconStyle["icon-link"]} ${iconStyle["icon-link-left"]}`} onClick={() => setIsPlaySound(!isPlaySound)}>
                    <img src={isPlaySound ? soundIcon : soundMuteIcon} className={iconStyle["icon"]} alt="sound-icon" />
                    <div className={`${iconStyle["icon-description"]} ${colorStyle["black-font"]}`}>
                        {isPlaySound ? "효과음 끄기" : "효과음 켜기"}
                    </div>
                </div>
            </div>
            <div id={style["right-container"]}>
                <Icon
                    name={role !== null ? "마이페이지" : "로그인"}
                    link={role !== null ? "/myPage" : "/login"}
                    alt="profile-icon"
                    source={profileIcon}
                    direction="right"
                />
                <div id={style["game-list"]}>
                    <div id={style["game-list-description"]}>GAME</div>
                    <Link to="/game/red" className={`${style["game-button"]} ${colorStyle["red-background"]}`}></Link>
                    <Link to="/game/orange" className={`${style["game-button"]} ${colorStyle["orange-background"]}`}></Link>
                    <Link to="/game/yellow" className={`${style["game-button"]} ${colorStyle["yellow-background"]}`}></Link>
                    <Link to="/game/green" className={`${style["game-button"]} ${colorStyle["green-background"]}`}></Link>
                    <Link to="/game/skyblue" className={`${style["game-button"]} ${colorStyle["skyblue-background"]}`}></Link>
                    <Link to="/game/blue" className={`${style["game-button"]} ${colorStyle["blue-background"]}`}></Link>
                    <Link to="/game/purple" className={`${style["game-button"]} ${colorStyle["purple-background"]}`}></Link>
                    <Link to="/game/pink" className={`${style["game-button"]} ${colorStyle["pink-background"]}`}></Link>
                    <Link to="/game/black" className={`${style["game-button"]} ${colorStyle["black-background"]}`}></Link>
                </div>
            </div>
        </div>
    );
}

export default Header;