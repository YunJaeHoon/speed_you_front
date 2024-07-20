import React, { useContext } from 'react';

import ThemeContext from "../context/ThemeContext.js";

import style from './FooterStyle.module.css';
import colorStyle from '../style/Color.module.css'

import lightLogo from '../image/logo-light.svg';
import darkLogo from '../image/logo-dark.svg';
import { Link } from 'react-router-dom';

function Footer({ isExistScrollbar }) {

    // context
    const { theme } = useContext(ThemeContext);

    return (
        <div
            id={style["background"]}
            style={{
                position: !isExistScrollbar ? "absolute" : "relative",
                bottom: !isExistScrollbar ? 0 : "auto",
                borderTop: `0.22vh solid ${theme === "LIGHT" ? "#CCCCCC" : "#606060"}`
            }}
        >
            <div id={style["left-container"]}>
                <Link to={"/"}>
                    <img
                        src={theme === "LIGHT" ? lightLogo : darkLogo}
                        id={style["logo"]}
                        alt="logo"
                    />
                </Link>
                <Link
                    to={"/term/service"}
                    className={`
                        ${style["link"]}
                        ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
                    `}
                >이용약관</Link>
                <Link
                    to={"/term/privacy"}
                    className={`
                        ${style["link"]}
                        ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
                    `}
                >개인정보처리방침</Link>
            </div>
            <div
                id={style["right-container"]}
                className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
            >Copyright ⓒ 2024 Speed.you all rights reserved</div>
        </div>
    );
}

export default Footer;