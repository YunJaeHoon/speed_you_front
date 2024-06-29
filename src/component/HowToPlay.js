import React from 'react';

import style from '../style/component_style/HowToPlayStyle.module.css';

function HowToPlay({ title, iconSource, description }) {

    return (
        <div id={style["container"]}>
            <div id={style["title-container"]}>
                <img src={iconSource} id={style["title-icon"]} alt="game-icon" />
                <span id={style["title"]}>
                    {title}
                </span>
            </div>
            <div id={style["description-container"]}>
                <div id={style["description-icon"]}>
                    게임 방법
                </div>
                <div id={style["description"]}>
                    {description}
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;