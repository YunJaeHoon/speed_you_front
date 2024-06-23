import React from 'react';
import { Link } from 'react-router-dom';
import style from '../style/HeaderStyle.module.css';

function Icon({ name, link, alt, source, direction }) {

    if(direction === "left")
    {
        return (
            <Link className={style["icon-link"]} to={ link }>
                <img src={ source } className={style["icon"]} alt={ alt } />
                <div className={style["icon-description"]}>
                    { name }
                </div>
            </Link>
        );
    }
    else
    {
        return (
            <Link className={style["icon-link"]} to={ link }>
                <div className={style["icon-description"]}>
                    { name }
                </div>
                <img src={ source } className={style["icon"]} alt={ alt } />
            </Link>
        );
    }
}

export default Icon;