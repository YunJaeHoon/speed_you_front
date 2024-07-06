import React from 'react';

import style from './HowToPlayStyle.module.css';
import colorStyle from '../style/Color.module.css';

function HowToPlay({ title, iconSource, iconSize, description, stopwatch }) {

    return (
        <div id={style["container"]}>
            <div id={style["title-container"]}>
                <span id={style["icon-container"]}>
                    <img src={iconSource} style={{ width: iconSize, height: iconSize }} alt="game-icon" />
                </span>
                <span id={style["title"]} className={colorStyle["black-font"]}>
                    {title}
                </span>
            </div>
            <div id={style["description-container"]}>
                <div id={style["description-title"]} className={colorStyle["black-font"]}>
                    게임 방법
                </div>
                <div id={style["description"]} className={colorStyle["black-font"]}>
                    {description}
                </div>
                <div id={style["description-title"]} className={colorStyle["black-font"]}>
                    제한 시간
                </div>
                <div id={style["description"]} className={colorStyle["black-font"]}>
                    {stopwatch}
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;