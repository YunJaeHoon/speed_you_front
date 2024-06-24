import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';

import Header from '../../component/Header';
import HowToPlay from '../../component/HowToPlay';
import BackgroundMusicPlayer from '../../component/BackgroundMusicPlayer';

import style from '../../style/page_style/game/RedStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import redIcon from '../../image/red-icon.svg';
import score_sound from '../../sound/red_score_sound.mp3';
import countDown_sound from '../../sound/red_countDown_sound.mp3';
import gameStart_sound from '../../sound/red_gameStart_sound.mp3';
import backgroundMusic from '../../sound/red_background_music.mp3';

function RedGamePage() {

    let content = null;

    // state
    const [step, setStep] = useState("READY");              // 게임 절차
    const [countDown, setCountDown] = useState(3);          // 카운트다운
    const [stopwatch, setStopwatch] = useState(60);         // 제한 시간
    const [score, setScore] = useState(0);                  // 점수
    const [whichBlock, setWhichBlock] = useState(10);       // red-block index
    const [gameOver, setGameOver] = useState(false);        // 게임 종료 여부

    // 효과음
    const [playScoreSound] = useSound(score_sound, { volume: 0.5 });
    const [playCountDownSound] = useSound(countDown_sound, { volume: 0.5 });
    const [playGameStartSound] = useSound(gameStart_sound);

    // 카운트다운
    useEffect(() => {

        if (step === "PLAY" && countDown > 0) {
            setTimeout(() => setCountDown(countDown - 1), 1000);    // 1초마다 감소
            playCountDownSound();
        }
        else if (countDown === 0) {
            setCountDown("Game start"); // 카운트다운 종료
            playGameStartSound()
        }

    }, [step, countDown]);

    // 제한 시간
    useEffect(() => {

        if (countDown === "Game start" && stopwatch > 0) {
            setTimeout(() => setStopwatch((stopwatch - 1)), 1000);  // 1초마다 감소
        }
        else if (stopwatch === 0) {
            setGameOver(true);  // 제한 시간 종료
        }

    }, [countDown, stopwatch]);

    // 게임 시작 ( red-block 결정 )
    useEffect(() => {

        if (countDown === "Game start") {
            setWhichBlock(Math.floor(Math.random() * 9) + 1);
        }

    }, [countDown]);

    useEffect(() => {

        // 키보드 입력 처리 함수
        function handleKeyDown(event) {
            if (
                (whichBlock === 1 && event.key === '1' && event.location === 3) ||
                (whichBlock === 2 && event.key === '2' && event.location === 3) ||
                (whichBlock === 3 && event.key === '3' && event.location === 3) ||
                (whichBlock === 4 && event.key === '4' && event.location === 3) ||
                (whichBlock === 5 && event.key === '5' && event.location === 3) ||
                (whichBlock === 6 && event.key === '6' && event.location === 3) ||
                (whichBlock === 7 && event.key === '7' && event.location === 3) ||
                (whichBlock === 8 && event.key === '8' && event.location === 3) ||
                (whichBlock === 9 && event.key === '9' && event.location === 3)
            ) {
                setScore(score + 1);
                setWhichBlock(Math.floor(Math.random() * 9) + 1);
                playScoreSound();
            }
        }

        // 게임 진행 중이면, 키보드 입력 이벤트마다 함수 호출
        if (!gameOver) {
            window.addEventListener("keydown", handleKeyDown);
        }
        else {
            window.removeEventListener("keydown", handleKeyDown);
        }

        // 다른 페이지로 넘어갈 때, 이벤트 리스너 제거
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, [whichBlock, score, gameOver]);

    // 게임 시작 버튼
    function play() {
        setStep("PLAY");
    }

    if (step === "READY") {
        content = <div>
            <HowToPlay
                title="Red"
                iconSource={redIcon}
                description={
                    <div>
                        해당 게임은 키보드의 우측 숫자 키패드(1 ~ 9)를 이용합니다.<br />
                        게임 화면의 <b><span style={{ "color": "#FF1F00" }}>붉은색</span></b> 빛이 들어온 버튼에 해당하는 키패드를 누르세요.<br />
                        주어진 시간 안에 누른 횟수만큼 점수가 측정됩니다.
                    </div>
                }
            />
            <div id={style["start-button"]} className={colorStyle["red-main"]} onClick={play} >
                Start
            </div>
        </div>
    }
    else if (step === "PLAY") {
        content = <div>
            <BackgroundMusicPlayer soundSource={backgroundMusic} volume={0.10} />
            <div id={style["container"]}>
                <div id={style["top-container"]}>
                    <div className={style["top-subcontainer"]}>
                        <div className={style["information-title"]}>제한 시간</div>
                        <div className={style["information"]}>{stopwatch}</div>
                    </div>
                    <div id={countDown === "Game start" ? style["game-start"] : style["count-down"]}>{countDown}</div>
                    <div className={style["top-subcontainer"]}>
                        <div className={style["information-title"]}>점수</div>
                        <div className={style["information"]}>{score}</div>
                    </div>
                </div>
                <div id={style["game-container"]}>
                    <div className={style["line"]}>
                        {
                            whichBlock === 7 ?
                                <div className={style["red-block"]}></div> :
                                <div className={style["block"]}></div>
                        }
                        {
                            whichBlock === 8 ?
                                <div className={style["red-block"]}></div> :
                                <div className={style["block"]}></div>
                        }
                        {
                            whichBlock === 9 ?
                                <div className={style["red-block"]}></div> :
                                <div className={style["block"]}></div>
                        }
                    </div>
                    <div className={style["line"]}>
                        {
                            whichBlock === 4 ?
                                <div className={style["red-block"]}></div> :
                                <div className={style["block"]}></div>
                        }
                        {
                            whichBlock === 5 ?
                                <div className={style["red-block"]}></div> :
                                <div className={style["block"]}></div>
                        }
                        {
                            whichBlock === 6 ?
                                <div className={style["red-block"]}></div> :
                                <div className={style["block"]}></div>
                        }
                    </div>
                    <div className={style["line"]}>
                        {
                            whichBlock === 1 ?
                                <div className={style["red-block"]}></div> :
                                <div className={style["block"]}></div>
                        }
                        {
                            whichBlock === 2 ?
                                <div className={style["red-block"]}></div> :
                                <div className={style["block"]}></div>
                        }
                        {
                            whichBlock === 3 ?
                                <div className={style["red-block"]}></div> :
                                <div className={style["block"]}></div>
                        }
                    </div>
                </div>
            </div>
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