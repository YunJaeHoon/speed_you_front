import React, { useContext } from 'react';

import ThemeContext from "../context/ThemeContext.js";

import style from './GameSelectButtonStyle.module.css';
import colorStyle from '../style/Color.module.css';

function GameSelectButton({ game, currentGame, background, onClick }) {

    const { theme } = useContext(ThemeContext);

    return (
        <span
            className={`
                ${style["game-select-button"]}
                ${colorStyle[background]}
                ${game === currentGame ? style["current-game"] : ""}
                ${theme === "LIGHT" ? style["game-select-button-light"] : style["game-select-button-dark"]}
            `}
            onClick={onClick}
        >
        </span>
    );
}

export default GameSelectButton;