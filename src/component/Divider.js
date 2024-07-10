import React, { useContext } from 'react';
import style from './DividerStyle.module.css';

import ThemeContext from "../context/ThemeContext.js";

function Divider() {

    // context
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme === "LIGHT" ? style["divider-light"] : style["divider-dark"]}>
        </div>
    );
}

export default Divider;