import React, { useState, useEffect, useContext, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import useSound from 'use-sound';
import { sendApi, refreshAccessToken } from '../../util/apiUtil.js';

import HowToPlay from '../../component/HowToPlay';
import Result from '../../component/Result';
import WaitServer from '../../component/WaitServer.js';
import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './BlueStyle.module.css';
import gameStyle from './GameStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import animationStyle from '../../App.module.css';

import blueIcon from '../../image/blue-icon.svg';
import lightWheelIcon from '../../image/blue-wheel-icon-light.svg';
import darkWheelIcon from '../../image/blue-wheel-icon-dark.svg';
import lightDirectionIcon from '../../image/blue-direction-icon-light.svg';
import darkDirectionIcon from '../../image/blue-direction-icon-dark.svg';
import ready_sound from '../../sound/blue_ready_sound.mp3';
import move_sound from '../../sound/red_score_sound.mp3';
import score_sound from '../../sound/blue_score_sound.mp3';
import wrong_sound from '../../sound/red_wrong_sound.mp3';
import countDown_sound from '../../sound/countDown_sound.mp3';
import gameStart_sound from '../../sound/gameStart_sound.mp3';
import gameOver_sound from '../../sound/gameOver_sound.mp3';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';
import blueBackgroundMusic from '../../sound/blue_background_music.mp3';

function BlueGamePage() {

    let content = null;
    const wheelSize = 30;       // 타륜 크기
    const directionSize = 6;    // 삼각형 크기

    // 삼각형 배치
    const directionLocation = [
        {
            left: (-1) * directionSize / 2,
            top: (-1) * directionSize / 3 - (3 * wheelSize / 4),
            rotate: 0
        },
        {
            left: (-1) * directionSize / 2 + (3 * wheelSize / 8) + directionSize,
            top: (-1) * directionSize / 3 - (3 * wheelSize / 8) - directionSize,
            rotate: 45
        },
        {
            left: (-1) * directionSize / 2 + (3 * wheelSize / 4),
            top: (-1) * directionSize / 3,
            rotate: 90
        },
        {
            left: (-1) * directionSize / 2 + (3 * wheelSize / 8) + directionSize,
            top: (-1) * directionSize / 3 + (3 * wheelSize / 8) + directionSize,
            rotate: 135
        },
        {
            left: (-1) * directionSize / 2,
            top: (-1) * directionSize / 3 + (3 * wheelSize / 4),
            rotate: 180
        },
        {
            left: (-1) * directionSize / 2 - (3 * wheelSize / 8) - directionSize,
            top: (-1) * directionSize / 3 + (3 * wheelSize / 8) + directionSize,
            rotate: 225
        },
        {
            left: (-1) * directionSize / 2 - (3 * wheelSize / 4),
            top: (-1) * directionSize / 3,
            rotate: 270
        },
        {
            left: (-1) * directionSize / 2 - (3 * wheelSize / 8) - directionSize,
            top: (-1) * directionSize / 3 - (3 * wheelSize / 8) - directionSize,
            rotate: 315
        },
    ]

    // context
    const { isPlaySound, currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [step, setStep] = useState("READY");              // 게임 절차
    const [countDown, setCountDown] = useState(3);          // 카운트다운
    const [stopwatch, setStopwatch] = useState(30);         // 제한 시간
    const [score, setScore] = useState(0);                  // 점수
    const [countAll, setCountAll] = useState(0);            // 전체 결과 개수
    const [rank, setRank] = useState(0);                    // 순위
    const [percentile, setPercentile] = useState(0);        // 상위 퍼센트

    const [directionIndex, setDirectionIndex] = useState(0);        // 방향 index
    const [wheelRotate, setWheelRotate] = useState(0);              // 타륜 회전갹

    // 효과음
    const [playMoveSound] = useSound(move_sound, { volume: 0.4 });
    const [playScoreSound] = useSound(score_sound, { volume: 0.7 });
    const [playWrongSound] = useSound(wrong_sound, { volume: 1 });
    const [playCountDownSound] = useSound(countDown_sound, { volume: 0.35 });
    const [playGameStartSound, { stop: stopGameStartSound }] = useSound(gameStart_sound, { volume: 0.7 });
    const [playGameOverSound, { stop: stopGameOverSound }] = useSound(gameOver_sound);

    const [playReadySound, { stop: stopReadySound }] = useSound(ready_sound, { volume: 0.3 });

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
            stopReadySound();
        };

    }, [stopGameStartSound, stopGameOverSound, stopReadySound]);

    // 카운트다운
    useEffect(() => {

        if (step === "PLAY" && countDown > 0) {

            if (countDown === 3) {
                if (isPlaySound) playReadySound();
            }

            setTimeout(() => setCountDown(countDown - 1), 1000);        // 1초마다 감소
            if (isPlaySound) playCountDownSound();                      // 카운트다운 효과음
        }
        else if (step === "PLAY" && countDown === 0) {
            setCountDown("Game start");                 // 카운트다운 종료
            if (isPlaySound) playGameStartSound();      // 게임 시작 효과음
        }

    }, [step, countDown]);

    // 제한 시간
    useEffect(() => {

        if (step === "PLAY" && countDown === "Game start" && stopwatch > 0) {
            setTimeout(() => setStopwatch((stopwatch - 1)), 1000);  // 1초마다 감소
        }
        else if (step === "PLAY" && countDown === "Game start" && stopwatch === 0) {
            setStep("OVER");    // 제한 시간 종료
        }

    }, [countDown, stopwatch, step]);

    // 게임 시작
    useEffect(() => {

        if (countDown === "Game start") {
            setDirectionIndex(Math.floor(Math.random() * 7) + 1)
        }

    }, [countDown]);

    // 키보드 입력 처리 함수
    const handleKeyDown = useCallback((event) => {

        // 움직임 제어 (방향키)
        if(event.key === 36 || event.key === "ArrowLeft" || event.key === 37 || event.key === "ArrowRight") {

            // 왼쪽 방향키
            if (event.key === 36 || event.key === "ArrowLeft") {
                if(directionIndex === 0) {
                    setDirectionIndex(7);
                }
                else {
                    setDirectionIndex(directionIndex - 1);
                }
                setWheelRotate(wheelRotate - 45);
            }
            // 오른쪽 방향키
            else if (event.key === 37 || event.key === "ArrowRight") {
                if(directionIndex === 7) {
                    setDirectionIndex(0);
                }
                else {
                    setDirectionIndex(directionIndex + 1);
                }
                setWheelRotate(wheelRotate + 45);
            }

            playMoveSound();
        }
        // 점수 제어 (스페이스 바)
        else if(event.key === 32 || event.key === " " || event.key === "Spacebar") {

            if(directionIndex === 0) {
                setScore(score + 1);
                setDirectionIndex(Math.floor(Math.random() * 7) + 1)
                if (isPlaySound) playScoreSound();
            }
            else {
                setScore(score - 1);
                if (isPlaySound) playWrongSound();
            }

        }

    }, [score, isPlaySound, directionIndex]);

    // 게임 진행 중
    useEffect(() => {

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

    }, [score, isPlaySound, step, directionIndex]);

    // 게임 종료
    useEffect(() => {
        if (step === "OVER") {
            const getResult = async () => {

                await refreshAccessToken();

                try {
                    await sendApi(
                        '/api/game/insert-score',
                        "POST",
                        true,
                        {
                            "game": "Blue",
                            "score": score
                        }
                    );
                }
                finally {
                    try {
                        const response = await sendApi(
                            '/api/game/result',
                            "GET",
                            false,
                            {
                                "game": "Blue",
                                "score": score
                            }
                        );

                        setCountAll(response.count_all);
                        setRank(response.rank);
                        setPercentile(response.percentile);
                    }
                    catch {
                        setCountAll("???");
                        setRank("???");
                        setPercentile("???");
                    }
                    finally {
                        if (isPlaySound) playGameOverSound();    // 게임 종료 효과음
                        setStep("RESULT");
                    }
                }
            }

            getResult();
        }
    }, [step]);

    // 게임 시작 버튼
    function play() {
        setStep("PLAY");
        setCurrentMusic(blueBackgroundMusic);
        setCurrentMusicVolume(0.16);
    }

    // 재시도 버튼
    function retry() {
        setStep("READY");
        setCurrentMusic(homeBackgroundMusic);
        setCurrentMusicVolume(1);

        setCountDown(3);
        setStopwatch(30);
        setScore(0);

        setDirectionIndex(0);
        setWheelRotate(0);
    }

    if (step === "READY") {
        content = <div id={gameStyle["container"]}>
            <HowToPlay
                title="Blue"
                iconSource={blueIcon}
                iconSize={"13vh"}
                description={
                    <div>
                        방향키의 왼쪽(◀), 오른쪽(▶) 키와 스페이스 바를 사용해라!<br />
                        타륜 주위의 <b className={colorStyle["blue-font"]}>삼각형</b>이 <b>정면</b>(▲)을 향하도록 키를 돌리고, <b>스페이스 바</b>를 눌러라!<br />
                        방향이 틀렸을 때, 스페이스 바를 누르면 점수가 깎이게 될 것이야!<br />
                    </div>
                }
                stopwatch="30초"
            />
            <div id={gameStyle["start-button"]} className={colorStyle["blue-background"]} onClick={play} >
                Start
            </div>
        </div>
    }
    else if (step === "PLAY") {
        content = <div id={gameStyle["container"]} style={theme === "LIGHT" ? {backgroundColor: "#0085FF"} : {backgroundColor: "#002081"}}>
            <div id={gameStyle["top-container"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                <div className={gameStyle["top-subcontainer"]}>
                    <div className={gameStyle["information-title"]}>제한 시간</div>
                    <div className={gameStyle["information"]}>{stopwatch}</div>
                </div>
                <div id={countDown === "Game start" ? gameStyle["game-start"] : gameStyle["count-down"]}>{countDown}</div>
                <div className={gameStyle["top-subcontainer"]}>
                    <div className={gameStyle["information-title"]}>점수</div>
                    <div className={gameStyle["information"]}>{score}</div>
                </div>
            </div>
            <div id={style["game-container"]}>
                <div id={style["wheel-container"]}>
                    <img
                        src={theme === "LIGHT" ? lightWheelIcon : darkWheelIcon}
                        id={style["wheel"]}
                        style={{
                            width: wheelSize + "vh",
                            left: (-1) * wheelSize / 2 + "vh",
                            top: (-1) * wheelSize / 2 + "vh",
                            transform:" rotate(" + wheelRotate + "deg" + ")"
                        }}
                        alt={"wheel-icon"}
                    />
                    <img
                        src={theme === "LIGHT" ? lightDirectionIcon : darkDirectionIcon}
                        id={style["direction"]}
                        style={{
                            width: directionSize + "vh",
                            left: directionLocation[directionIndex].left + "vh",
                            top: directionLocation[directionIndex].top + "vh",
                            transform:" rotate(" + directionLocation[directionIndex].rotate + "deg" + ")"
                        }}
                        alt={"direction-icon"}
                    />
                </div>
            </div>
        </div>
    }
    else if (step === "OVER") {
        content = <div id={gameStyle["container"]}>
            <WaitServer />
        </div>
    }
    else if (step === "RESULT") {
        content = <div id={gameStyle["container"]}>
            <Result
                game="Blue"
                fontColor="blue-font"
                score={score}
                countAll={countAll}
                rank={rank}
                percentile={percentile}
            />
            <div id={gameStyle["start-button"]} className={colorStyle["blue-background"]} onClick={retry} >
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

export default BlueGamePage;