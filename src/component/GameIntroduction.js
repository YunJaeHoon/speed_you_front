import React from 'react';
import { Link } from 'react-router-dom';
import style from '../style/HomeStyle.module.css';

function GameIntroduction({ iconSource, iconSize, title, link, description }) {

    return (
        <div className={style["game-introduction"]}>
            <span style={{ "width": "85%", "display": "flex", "text-align": "center" }}>
                <span className={style["game-icon-container"]}>
                    <img src={iconSource} style={{ width: iconSize, height: iconSize }} alt="game-icon" />
                </span>
                <span className={style["game-description-block"]}>
                    <div className={style["game-title"]}>{title}</div>
                    <div className={style["game-description"]}>{description}</div>
                </span>
            </span>
            <span style={{ "width": "15%", "display": "flex", "justifyContent": "end" }}>
                <Link to={link} className={style["game-play-button"]}>
                    PLAY
                </Link>
            </span>
        </div>
    );
}

export default GameIntroduction;