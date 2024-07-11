import React, { useContext } from 'react';

import ThemeContext from "../context/ThemeContext";

import colorStyle from '../style/Color.module.css';

function WaitServer() {

  // context
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}
      style={{ textAlign: 'center', fontSize: "6vh", marginTop: "38vh" }}
    >
      서버로부터 응답을 기다리는 중입니다.<br />
      잠시만 기다려주세요.
    </div>
  );
}

export default WaitServer;