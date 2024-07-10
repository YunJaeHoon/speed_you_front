import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import ThemeContext from "../context/ThemeContext.js";

import style from './IconStyle.module.css';
import colorStyle from '../style/Color.module.css'

function Icon({ name, link, alt, source, direction }) {

    // context
    const { theme } = useContext(ThemeContext);

    if (direction === "left") {
        return (
            <Link className={`${style["icon-link"]} ${style["icon-link-left"]}`} to={link}>
                <img src={source} className={style["icon"]} alt={alt} />
                <div className={`${style["icon-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>
                    {name}
                </div>
            </Link>
        );
    }
    else {
        return (
            <Link className={`${style["icon-link"]} ${style["icon-link-right"]}`} to={link}>
                <div className={`${style["icon-description"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>
                    {name}
                </div>
                <img src={source} className={style["icon"]} alt={alt} />
            </Link>
        );
    }
}

export default Icon;