import React, { useState } from 'react';
import axios from 'axios';

import Header from '../../component/Header';
import HowToPlay from '../../component/HowToPlay';

import style from '../../style/RedStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import redIcon from '../../image/red-icon.svg';

function RedGamePage() {

    let content = null;

    // state
    const [step, setStep] = useState("READY");     // 게임 절차

    function play() {
        setStep("PLAY");
    }

    if(step === "READY")
    {
        content = <div>
            <HowToPlay
                title = "Red"
                iconSource = { redIcon }
                description = <div>
                    해당 게임은 키보드의 우측 숫자 키패드(1 ~ 9)를 이용합니다.<br />
                    게임 화면의 <b><span style={{"color": "#FF1F00"}}>붉은색</span></b> 빛이 들어온 버튼에 해당하는 키패드를 누르세요.<br />
                    주어진 시간 안에 누른 횟수만큼 점수가 측정됩니다.
                </div>
            />
            <div id={style["start-button"]} className={colorStyle["red-main"]} onClick={play} >
                Start
            </div>
        </div>
    }
    else if(step === "PLAY")
    {
        content = <div>
            play
        </div>
    }

    return (
        <div>
            <Header />
            {content}
        </div>
    );
}

export default RedGamePage;