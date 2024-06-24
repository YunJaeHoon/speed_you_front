import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Icon from './Icon';

import style from '../style/component_style/HeaderStyle.module.css';
import logo from '../image/logo.svg';
import profileIcon from '../image/profile-icon.svg';
import rankingIcon from '../image/ranking-icon.svg';
import suggestionIcon from '../image/suggestion-icon.svg';
import announcementIcon from '../image/announcement-icon.svg';

function Header() {

    // state
    const [isLogin, setIsLogin] = useState(false);  // 로그인 여부

    useEffect(() => {

        axios.get('/api/is-login', null)
            .then((response) => {
                setIsLogin(response.data.data.toLowerCase() === "true");
            }).catch((error) => {
                setIsLogin(false);
            });

    }, []);

    return (
        <div id={style["container"]}>
            <div id={style["left-container"]}>
                <Link to="/" id={style["logo-container"]}>
                    <img src={logo} id={style["logo"]} alt="Speed.you logo" />
                </Link>
                <Icon name="랭킹" link="/" alt="ranking-icon" source={rankingIcon} direction="left" />
                <Icon name="건의사항" link="/" alt="suggestion-icon" source={suggestionIcon} direction="left" />
                <Icon name="공지사항" link="/" alt="announcement-icon" source={announcementIcon} direction="left" />
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