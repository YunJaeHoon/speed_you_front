import React, { useContext } from 'react';
import { BarLoader } from "react-spinners";

import ThemeContext from "../context/ThemeContext";

import style from './WaitServerStyle.module.css';
import colorStyle from '../style/Color.module.css';

function WaitServer() {

  // context
  const { theme } = useContext(ThemeContext);

  return (
    <div id={style["container"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
      <div id={style["content"]}>
        <div id={style["message"]}>
          서버로부터 응답을 기다리는 중입니다.<br />
          잠시만 기다려주세요.
        </div>
        <BarLoader
          id={style["load-icon"]}
          color={theme === "LIGHT" ? "#20201E" : "#FFFFFF"}
          speedMultiplier={1.3}
        />
      </div>
    </div>
  );
}

export default WaitServer;