import React from 'react';

import style from '../style/component_style/ResultStyle.module.css';
import colorStyle from '../style/Color.module.css';

function Result({ game, fontColor, score, countAll, rank, percentile }) {

  return (
    <div id={style["container"]}>
      <div id={style["game-over-title"]}>
        게임 종료
      </div>
      <div id={style["score-container"]}>
        <span>점수 : {score}</span>
        <span className={colorStyle[fontColor]}>{game}</span>
      </div>
      <div id={style["horizontal-divider"]}></div>
      <div id={style["result-container"]}>
        <span id={style["result-summary"]}>
          {rank} / {countAll}
        </span>
        <span id={style["vertical-divider"]}></span>
        <span>
          <div id={style["result-description"]}>
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