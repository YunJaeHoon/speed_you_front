import React from 'react';

import style from '../style/HowToPlayStyle.module.css';
import colorStyle from '../style/Color.module.css';

function HowToPlay({ title, iconSource, description }) {

    return (
        <div id={style["container"]}>
            <div id={style["title-container"]}>
                <img src={ iconSource } id={style["title-icon"]} />
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