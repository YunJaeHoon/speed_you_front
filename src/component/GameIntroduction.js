import React from 'react';
import { Link } from 'react-router-dom';
import style from './GameIntroductionStyle.module.css';
import colorStyle from '../style/Color.module.css';

function GameIntroduction({ iconSource, iconSize, title, link, description }) {

    return (
        <div id={style["container"]}>
            <span id={style["left-container"]}>
                <span className={style["icon-container"]}>
                    <img src={iconSource} style={{ width: iconSize, height: iconSize }} alt="game-icon" />
                </span>
                <span className={style["description-container"]}>
                    <div id={style["game-title"]} className={colorStyle["black-font"]}>{title}</div>
                    <div id={style["game-description"]} className={colorStyle["black-font"]}>{description}</div>
                </span>
            </span>
            <span id={style["right-container"]}>
                <Link to={link} className={style["game-play-button"]}>
                    PLAY
                </Link>
            </span>
        </div>
    );
}

export default GameIntroduction;