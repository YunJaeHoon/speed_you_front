import React from 'react';

import style from './ResultStyle.module.css';
import colorStyle from '../style/Color.module.css';

function Result({ game, fontColor, score, countAll, rank, percentile }) {

  return (
    <div id={style["container"]}>
      <div id={style["title"]} className={colorStyle["black-font"]}>
        게임 종료
      </div>
      <div id={style["score-container"]} className={colorStyle["black-font"]}>
        <span>점수 : {score}</span>
        <span className={colorStyle[fontColor]}>{game}</span>
      </div>
      <div id={style["horizontal-divider"]} className={colorStyle["black-background"]}></div>
      <div id={style["result-container"]}>
        <span id={style["result-summary"]} className={colorStyle["black-font"]}>
          {rank} / {countAll}
        </span>
        <span id={style["vertical-divider"]} className={colorStyle["black-background"]}></span>
        <span>
          <div id={style["result-description"]} className={colorStyle["black-font"]}>
            <div>
              당신은 {countAll}명 중, {rank}번째로 빠릅니다.<br />
              당신은 <b className={colorStyle[fontColor]}>상위 {percentile}%</b> 입니다.
            </div>
          </div>
        </span>
      </div>
    </div>
  );
}

export default Result;