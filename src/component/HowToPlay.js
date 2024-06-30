import React from 'react';

import style from '../style/component_style/HowToPlayStyle.module.css';

function HowToPlay({ title, iconSource, iconSize, description, stopwatch }) {

    return (
        <div id={style["container"]}>
            <div id={style["title-container"]}>
                <span id={style["icon-container"]}>
                    <img src={iconSource} style={{ width: iconSize, height: iconSize }} alt="game-icon" />
                </span>
                <span id={style["title"]}>
                    {title}
                </span>
            </div>
            <div id={style["description-container"]}>
                <div id={style["description-title"]}>
                    게임 방법
                </div>
                <div id={style["description"]}>
                    {description}
                </div>
                <div id={style["description-title"]}>
                    제한 시간
                </div>
                <div id={style["description"]}>
                    {stopwatch}
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;