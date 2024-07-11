import React, { useContext } from 'react';

import style from './HowToPlayStyle.module.css';
import colorStyle from '../style/Color.module.css';
import ThemeContext from "../context/ThemeContext";

function HowToPlay({ title, iconSource, iconSize, description, stopwatch }) {

    // context
    const { theme } = useContext(ThemeContext);

    return (
        <div id={style["container"]}>
            <div id={style["title-container"]} style={theme === "LIGHT" ? {borderBottom: "0.3vh solid #20201E"} : {borderBottom: "0.3vh solid #FFFFFF"}}>
                <span id={style["icon-container"]}>
                    <img src={iconSource} style={{ width: iconSize, height: iconSize }} alt="game-icon" />
                </span>
                <span id={style["title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                    {title}
                </span>
            </div>
            <div id={style["description-container"]}>
                <div id={style["description-title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                    게임 방법
                </div>
                <div id={style["description"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                    {description}
                </div>
                <div id={style["description-title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                    제한 시간
                </div>
                <div id={style["description"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                    {stopwatch}
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;