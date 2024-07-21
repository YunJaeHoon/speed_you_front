import React, { useContext } from 'react';

import style from './ResultStyle.module.css';
import colorStyle from '../style/Color.module.css';
import ThemeContext from "../context/ThemeContext";

function Result({ game, fontColor, score, countAll, rank, percentile, isValid }) {

  // context
  const { theme } = useContext(ThemeContext);

  return (
    <div id={style["container"]}>
      <div id={style["title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
        게임 종료
      </div>
      <div id={style["score-container"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
        <span>점수 : {score}</span>
        <span className={colorStyle[fontColor]}>{game}</span>
      </div>
      <div id={style["horizontal-divider"]} className={theme === "LIGHT" ? colorStyle["black-background"] : colorStyle["white-background"]}></div>
      <div id={style["result-container"]}>
        <span id={style["result-summary"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
          {rank} / {countAll}
        </span>
        <span id={style["vertical-divider"]} className={theme === "LIGHT" ? colorStyle["black-background"] : colorStyle["white-background"]}></span>
        <span>
          <div id={style["result-description"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
            {
              isValid ?
              <div>
                당신은 {countAll}명 중, {rank}번째로 빠릅니다.<br />
                당신은 <b className={colorStyle[fontColor]}>상위 {percentile}%</b> 입니다.
              </div> :
              <div>
                {game === "Green" ? "25000점 이상" : "0 이하"}의 점수는 집계되지 않습니다.<br />
                다시 시도하세요.
              </div>
            }
          </div>
        </span>
      </div>
    </div>
  );
}

export default Result;