import React, { useState, useEffect, useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import useSound from 'use-sound';
import axios from 'axios';

import HowToPlay from '../../component/HowToPlay';
import Result from '../../component/Result';
import WaitServer from '../../component/WaitServer.js';
import SoundContext from "../../context/SoundContext.js";

import style from '../../style/page_style/game/RedStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import animationStyle from '../../App.module.css';

import redIcon from '../../image/red-icon.svg';
import score_sound from '../../sound/red_score_sound.mp3';
import wrong_sound from '../../sound/red_wrong_sound.mp3';
import countDown_sound from '../../sound/countDown_sound.mp3';
import gameStart_sound from '../../sound/gameStart_sound.mp3';
import gameOver_sound from '../../sound/gameOver_sound.mp3';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';
import redBackgroundMusic from '../../sound/red_background_music.mp3';

function RedGamePage() {

    let content = null;

    // context
    const { isPlaySound, currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);

    // state
    const [step, setStep] = useState("READY");              // 게임 절차
    const [countDown, setCountDown] = useState(3);          // 카운트다운
    const [stopwatch, setStopwatch] = useState(30);         // 제한 시간
    const [score, setScore] = useState(0);                  // 점수
    const [whichBlock, setWhichBlock] = useState(10);       // red-block index
    const [countAll, setCountAll] = useState(0);            // 전체 결과 개수
    const [rank, setRank] = useState(0);                    // 순위
    const [percentile, setPercentile] = useState(0);        // 상위 퍼센트

    // 효과음
    const [playScoreSound] = useSound(score_sound, { volume: 0.5 });
    const [playWrongSound] = useSound(wrong_sound, { volume: 1 });
    const [playCountDownSound] = useSound(countDown_sound, { volume: 0.5 });
    const [playGameStartSound, { stop: stopGameStartSound }] = useSound(gameStart_sound);
    const [playGameOverSound, { stop: stopGameOverSound }] = useSound(gameOver_sound);

    // 페이지 입장, 퇴장 시에 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        return () => {
            stopGameStartSound();
            stopGameOverSound();
        };

    }, [stopGameStartSound, stopGameOverSound]);

    // 카운트다운
    useEffect(() => {

        if (step === "PLAY" && countDown > 0) {
            setTimeout(() => setCountDown(countDown - 1), 1000);    // 1초마다 감소
            isPlaySound && playCountDownSound();                    // 카운트다운 효과음
        }
        else if (step === "PLAY" && countDown === 0) {
            setCountDown("Game start");             // 카운트다운 종료
            isPlaySound && playGameStartSound();    // 게임 시작 효과음
        }

    }, [step, countDown]);

    // 제한 시간
    useEffect(() => {

        if (countDown === "Game start" && stopwatch > 0) {
            setTimeout(() => setStopwatch((stopwatch - 1)), 1000);  // 1초마다 감소
        }
        else if (countDown === "Game start" && stopwatch === 0) {
            setStep("OVER");    // 제한 시간 종료
        }

    }, [countDown, stopwatch]);

    // 게임 시작 ( red-block 결정 )
    useEffect(() => {

        if (countDown === "Game start") {
            setWhichBlock(Math.floor(Math.random() * 9) + 1);
        }

    }, [countDown]);

    // 게임 진행 중
    useEffect(() => {

        // 키보드 입력 처리 함수
        function handleKeyDown(event) {

            if (whichBlock.toString() === event.key && event.location === 3) {
                setScore(score + 1);
                setWhichBlock(Math.floor(Math.random() * 9) + 1);
                isPlaySound && playScoreSound();
            }
            else if (whichBlock.toString() !== event.key && event.location === 3) {
                setScore(score - 1);
                isPlaySound && playWrongSound();
            }

        }

        // 게임 진행 중이면, 키보드 입력 이벤트마다 함수 호출
        if (step === "PLAY" && countDown === "Game start") {
            window.addEventListener("keydown", handleKeyDown);
        }
        else {
            window.removeEventListener("keydown", handleKeyDown);
        }

        // 이벤트 리스너 제거
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, [whichBlock, score, isPlaySound, step]);

    // 게임 종료
    useEffect(() => {

        if (step === "OVER") {

            // 점수 등록
            axios.post('/api/game/insert-score',
                {
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem('token')}`
                    },

                    "game": "Red",
                    "score": score
                })
                .then()
                .catch()
                .finally(() => {

                    // 결과 확인
                    axios.get('/api/game/result',
                        {
                            headers: {
                                Authorization: `Bearer ${window.localStorage.getItem('token')}`
                            },

                            params: {
                                "game": "Red",
                                "score": score
                            }
                        })
                        .then((response) => {
                            setCountAll(response.data.data.count_all);
                            setRank(response.data.data.rank);
                            setPercentile(response.data.data.percentile);
                        })
                        .catch()
                        .finally(() => {
                            isPlaySound && playGameOverSound();    // 게임 종료 효과음
                            setStep("RESULT");
                        });

                });

        }

    }, [step]);

    // 게임 시작 버튼
    function play() {
        setStep("PLAY");
        setCurrentMusic(redBackgroundMusic);
        setCurrentMusicVolume(0.10);
    }

    // 재시도 버튼
    function retry() {
        setStep("READY");
        setCurrentMusic(homeBackgroundMusic);
        setCurrentMusicVolume(1);

        setCountDown(3);
        setStopwatch(30);
        setScore(0);
        setWhichBlock(10);
    }

    if (step === "READY") {
        content = <div>
            <HowToPlay
                title="Red"
                iconSource={redIcon}
                iconSize={68}
                description={
                    <div>
                        키보드의 우측 숫자 키패드(1 ~ 9)를 이용합니다.<br />
                        게임 화면의 <b className={colorStyle["red-font"]}>붉은색</b> 빛이 들어온 버튼에 해당하는 키패드를 누르세요.<br />
                        잘못된 버튼을 누르면 점수가 차감됩니다.<br />
                    </div>
                }
                stopwatch="30초"
            />
            <div id={style["start-button"]} className={colorStyle["red-main"]} onClick={play} >
                Start
            </div>
        </div>
    }
    else if (step === "PLAY") {
        content = <div id={style["container"]}>
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
    }
    else if (step === "OVER") {
        content = <div id={style["container"]}>
            <WaitServer />
        </div>
    }
    else if (step === "RESULT") {
        content = <div id={style["container"]}>
            <Result
                game="Red"
                fontColor="red-font"
                score={score}
                countAll={countAll}
                rank={rank}
                percentile={percentile}
            />
            <div id={style["start-button"]} className={colorStyle["red-main"]} onClick={retry} >
                재시도
            </div>
        </div>
    }

    return (
        <TransitionGroup>
            <CSSTransition key={step} timeout={100} classNames={{
                enter: animationStyle["fade-enter"],
                enterActive: animationStyle["fade-enter-active"],
                exit: animationStyle["fade-exit"],
                exitActive: animationStyle["fade-exit-active"],
            }}>
                {content}
            </CSSTransition>
        </TransitionGroup>
    );
}

export default RedGamePage;