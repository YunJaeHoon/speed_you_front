import React from 'react';
import { Link } from 'react-router-dom';
import style from '../style/HomeStyle.module.css';

function GameIntroduction({ color, title, link, description }) {

    return (
        <div className={style["game-introduction"]}>
            <span style={{ "display": "flex", "text-align": "center" }}>
                <div style={{ "background-color": color }} className={style["game-color"]}></div>
                <span className={style["game-description-block"]}>
                    <div className={style["game-title"]}>{title}</div>
                    <div className={style["game-description"]}>{description}</div>
                </span>
            </span>
            <span>
                <Link to={link} className={style["game-play-button"]}>
                    PLAY
                </Link>
            </span>
        </div>
    );
}

export default GameIntroduction;