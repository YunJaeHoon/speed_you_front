import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Icon from './Icon';
import SoundContext from "../context/SoundContext.js";
import LoginContext from "../context/LoginContext.js";
import ThemeContext from "../context/ThemeContext.js";

import style from './HeaderStyle.module.css';
import iconStyle from './IconStyle.module.css';
import colorStyle from '../style/Color.module.css';

import lightLogo from '../image/logo-light.svg';
import lightProfileIcon from '../image/profile-icon-light.svg';
import lightRankingIcon from '../image/ranking-icon-light.svg';
import lightSuggestionIcon from '../image/suggestion-icon-light.svg';
import lightMusicIcon from '../image/music-icon-light.svg';
import lightMusicMuteIcon from '../image/music-mute-icon-light.svg';
import lightSoundIcon from '../image/sound-icon-light.svg';
import lightSoundMuteIcon from '../image/sound-mute-icon-light.svg';
import lightModeIcon from '../image/light-mode-icon.svg';
import darkLogo from '../image/logo-dark.svg';
import darkProfileIcon from '../image/profile-icon-dark.svg';
import darkRankingIcon from '../image/ranking-icon-dark.svg';
import darkSuggestionIcon from '../image/suggestion-icon-dark.svg';
import darkMusicIcon from '../image/music-icon-dark.svg';
import darkMusicMuteIcon from '../image/music-mute-icon-dark.svg';
import darkSoundIcon from '../image/sound-icon-dark.svg';
import darkSoundMuteIcon from '../image/sound-mute-icon-dark.svg';
import darkModeIcon from '../image/dark-mode-icon.svg';

function Header() {

    // context
    const { isPlayMusic, setIsPlayMusic, isPlaySound, setIsPlaySound } = useContext(SoundContext);
    const { role } = useContext(LoginContext);
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <div id={style["background"]}>
            <div id={style["left-container"]}>
                <Link to="/">
                    <img src={theme === "LIGHT" ? lightLogo : darkLogo} id={style["logo"]} alt="Speed.you logo" />
                </Link>
                <Icon
                    name="랭킹"
                    link="/"
                    alt="ranking-icon"
                    source={theme === "LIGHT" ? lightRankingIcon : darkRankingIcon}
                    direction="left"
                />
                <Icon
                    name="건의사항"
                    link="/"
                    alt="suggestion-icon"
                    source={theme === "LIGHT" ? lightSuggestionIcon : darkSuggestionIcon}
                    direction="left"
                />
                <div className={theme === "LIGHT" ? style["divider-light"] : style["divider-dark"]}></div>
                <div className={`${iconStyle["icon-link"]} ${iconStyle["icon-link-left"]}`} onClick={() => setIsPlayMusic(!isPlayMusic)}>
                    <img
                        src={
                            isPlayMusic && theme === "LIGHT" ? lightMusicIcon :
                            !isPlayMusic && theme === "LIGHT" ? lightMusicMuteIcon :
                            isPlayMusic ? darkMusicIcon : darkMusicMuteIcon
                        }
                        className={iconStyle["icon"]}
                        alt="music-icon" 
                    />
                    <div className={`${iconStyle["icon-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>
                        {isPlayMusic ? "배경음 끄기" : "배경음 켜기"}
                    </div>
                </div>
                <div className={`${iconStyle["icon-link"]} ${iconStyle["icon-link-left"]}`} onClick={() => setIsPlaySound(!isPlaySound)}>
                    <img
                        src={
                            isPlaySound && theme === "LIGHT" ? lightSoundIcon :
                            !isPlaySound && theme === "LIGHT" ? lightSoundMuteIcon :
                            isPlaySound ? darkSoundIcon : darkSoundMuteIcon
                        }
                        className={iconStyle["icon"]}
                        alt="sound-icon"
                    />
                    <div className={`${iconStyle["icon-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>
                        {isPlaySound ? "효과음 끄기" : "효과음 켜기"}
                    </div>
                </div>
                <div className={`${iconStyle["icon-link"]} ${iconStyle["icon-link-left"]}`} onClick={() => setTheme(theme === "LIGHT" ? "DARK" : "LIGHT")}>
                    <img
                        src={ theme === "LIGHT" ? lightModeIcon : darkModeIcon }
                        className={iconStyle["icon"]}
                        alt="theme-icon"
                    />
                    <div className={`${iconStyle["icon-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>
                        {theme === "LIGHT" ? "다크 모드" : "라이트 모드"}
                    </div>
                </div>
            </div>
            <div id={style["right-container"]}>
                <Icon
                    name={role !== null ? "마이페이지" : "로그인"}
                    link={role !== null ? "/myPage" : "/login"}
                    alt="profile-icon"
                    source={theme === "LIGHT" ? lightProfileIcon : darkProfileIcon}
                    direction="right"
                />
                <div id={style["game-list"]}>
                    <div id={style["game-list-description"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>GAME</div>
                    <Link to="/game/red" className={`${style["game-button"]} ${theme === "LIGHT" ? style["game-button-light"] : style["game-button-dark"]} ${colorStyle["red-background"]}`}></Link>
                    <Link to="/game/orange" className={`${style["game-button"]} ${theme === "LIGHT" ? style["game-button-light"] : style["game-button-dark"]} ${colorStyle["orange-background"]}`}></Link>
                    <Link to="/game/yellow" className={`${style["game-button"]} ${theme === "LIGHT" ? style["game-button-light"] : style["game-button-dark"]} ${colorStyle["yellow-background"]}`}></Link>
                    <Link to="/game/green" className={`${style["game-button"]} ${theme === "LIGHT" ? style["game-button-light"] : style["game-button-dark"]} ${colorStyle["green-background"]}`}></Link>
                    <Link to="/game/skyblue" className={`${style["game-button"]} ${theme === "LIGHT" ? style["game-button-light"] : style["game-button-dark"]} ${colorStyle["skyblue-background"]}`}></Link>
                    <Link to="/game/blue" className={`${style["game-button"]} ${theme === "LIGHT" ? style["game-button-light"] : style["game-button-dark"]} ${colorStyle["blue-background"]}`}></Link>
                    <Link to="/game/purple" className={`${style["game-button"]} ${theme === "LIGHT" ? style["game-button-light"] : style["game-button-dark"]} ${colorStyle["purple-background"]}`}></Link>
                    <Link to="/game/pink" className={`${style["game-button"]} ${theme === "LIGHT" ? style["game-button-light"] : style["game-button-dark"]} ${colorStyle["pink-background"]}`}></Link>
                    <Link to="/game/black" className={`${style["game-button"]} ${theme === "LIGHT" ? style["game-button-light"] : style["game-button-dark"]} ${colorStyle["black-background"]}`}></Link>
                </div>
            </div>
        </div>
    );
}

export default Header;