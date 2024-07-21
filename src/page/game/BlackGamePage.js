import React, { useState, useEffect, useContext, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import useSound from 'use-sound';
import { sendApi, refreshAccessToken } from '../../util/apiUtil.js';

import HowToPlay from '../../component/HowToPlay';
import Result from '../../component/Result';
import WaitServer from '../../component/WaitServer.js';
import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './BlackStyle.module.css';
import gameStyle from './GameStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import animationStyle from '../../App.module.css';

import blackIcon from '../../image/black-icon.svg';
import orangeIcon from '../../image/black-orange-icon.svg';
import skyblueUpIcon from '../../image/black-skyblue-up-icon.svg';
import skyblueIncorrectUpIcon from '../../image/black-skyblue-up-incorrect-icon.svg';
import skyblueDownIcon from '../../image/black-skyblue-down-icon.svg';
import skyblueIncorrectDownIcon from '../../image/black-skyblue-down-incorrect-icon.svg';
import blueWheelIcon from '../../image/black-blue-wheel-icon.svg';
import blueDirectionIcon from '../../image/black-blue-direction-icon.svg';
import purpleForwardLeftIcon from '../../image/black-purple-left-forward-icon.svg';
import purpleForwardRightIcon from '../../image/black-purple-right-forward-icon.svg';
import purpleForwardUpIcon from '../../image/black-purple-up-forward-icon.svg';
import purpleForwardDownIcon from '../../image/black-purple-down-forward-icon.svg';
import purpleBackwardLeftIcon from '../../image/black-purple-left-backward-icon.svg';
import purpleBackwardRightIcon from '../../image/black-purple-right-backward-icon.svg';
import purpleBackwardUpIcon from '../../image/black-purple-up-backward-icon.svg';
import purpleBackwardDownIcon from '../../image/black-purple-down-backward-icon.svg';
import score_sound from '../../sound/black_score_sound.mp3';
import wrong_sound from '../../sound/red_wrong_sound.mp3';
import move_sound from '../../sound/red_score_sound.mp3';
import change_sound from '../../sound/black_change_sound.mp3';
import countDown_sound from '../../sound/countDown_sound.mp3';
import gameStart_sound from '../../sound/gameStart_sound.mp3';
import gameOver_sound from '../../sound/gameOver_sound.mp3';
import blackBackgroundMusic from '../../sound/black_background_music.mp3';

function BlackGamePage() {

    const games = [
        {name: "RED", volume: 10},
        {name: "ORANGE", volume: 8},
        {name: "YELLOW", volume: 5},
        {name: "GREEN", volume: 1},
        {name: "SKYBLUE", volume: 15},
        {name: "BLUE", volume: 5},
        {name: "PURPLE", volume: 10},
        {name: "PINK", volume: 10}
    ];

    let content = null;
    let gameContent = null;

    // context
    const { isPlaySound, currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { theme, setTheme } = useContext(ThemeContext);

    // state
    const [step, setStep] = useState("READY");              // 게임 절차
    const [countDown, setCountDown] = useState(3);          // 카운트다운
    const [stopwatch, setStopwatch] = useState(60);         // 제한 시간
    const [score, setScore] = useState(0);                  // 점수
    const [countAll, setCountAll] = useState(0);            // 전체 결과 개수
    const [rank, setRank] = useState(0);                    // 순위
    const [percentile, setPercentile] = useState(0);        // 상위 퍼센트

    const [game, setGame] = useState();                     // 게임 종류
    const [remaining, setRemaining] = useState();           // 현재 게임의 남은 할당량

    // RED
    const [whichBlock, setWhichBlock] = useState(10);           // red-block index
    // ORANGE
    const [showTarget, setShowTarget] = useState(false);        // 과녁 등장 여부
    const [targetW, setTargetW] = useState(0);                  // 과녁 가로 마진
    const [targetH, setTargetH] = useState(0);                  // 과녁 세로 마진
    // YELLOW
    const [playerLocation, setPlayerLocation] = useState(99);   // 플레이어 위치
    const [targetLocation, setTargetLocation] = useState(99);   // 목표 위치
    const blocks_YELLOW = Array.from({ length: 49 }, (_, index) => {
        const location = index + 1;
        return (
            playerLocation === location ? <div key={location} className={style["player-block-YELLOW"]}></div> :
            targetLocation === location ? <div key={location} className={style["target-block-YELLOW"]}></div> :
            <div key={location} className={style["block-YELLOW"]}></div>
        );
    });
    const lines_YELLOW = [];
    for (let i = 0; i < blocks_YELLOW.length; i += 7) {
        lines_YELLOW.push(
            <div key={i} className={style["line-YELLOW"]}>
                {blocks_YELLOW.slice(i, i + 7)}
            </div>
        );
    }
    // SKYBLUE
    const arrowNumber = 15;     // 화살표 개수
    const arrowMargin = 13;     // 화살표 간의 간격
    const [arrowIndex, setArrowIndex] = useState(0);    // 현재 화살표 index
    const [arrows, setArrows] = useState(Array.from({ length: arrowNumber }, (_, index) => ({
        left: index * arrowMargin,
        direction: 2,
        correct: 1
    })));
    // BLUE
    const wheelSize = 30;       // 타륜 크기
    const directionSize = 6;    // 삼각형 크기
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
    const [directionIndex, setDirectionIndex] = useState(0);    // 방향 index
    const [wheelRotate, setWheelRotate] = useState(0);          // 타륜 회전각
    // PURPLE
    const [direction, setDirection] = useState(0);              // 방향
    // PINK
    const [alphabet, setAlphabet] = useState();                 // 알파벳

    // 효과음
    const [playScoreSound] = useSound(score_sound, { volume: 0.6 });
    const [playWrongSound] = useSound(wrong_sound, { volume: 1 });
    const [playMoveSound] = useSound(move_sound, { volume: 0.4 });
    const [playChangeSound] = useSound(change_sound, { volume: 0.35 });
    const [playCountDownSound] = useSound(countDown_sound, { volume: 0.35 });
    const [playGameStartSound, { stop: stopGameStartSound }] = useSound(gameStart_sound, { volume: 0.7 });
    const [playGameOverSound, { stop: stopGameOverSound }] = useSound(gameOver_sound);

    if(game === "RED") {
        gameContent = <div id={style["game-container-RED"]}>
            <div className={style["line-RED"]}>
                {
                    whichBlock === 7 ?
                        <div className={style["red-block-RED"]}></div> :
                        <div className={style["block-RED"]}></div>
                }
                {
                    whichBlock === 8 ?
                        <div className={style["red-block-RED"]}></div> :
                        <div className={style["block-RED"]}></div>
                }
                {
                    whichBlock === 9 ?
                        <div className={style["red-block-RED"]}></div> :
                        <div className={style["block-RED"]}></div>
                }
            </div>
            <div className={style["line-RED"]}>
                {
                    whichBlock === 4 ?
                        <div className={style["red-block-RED"]}></div> :
                        <div className={style["block-RED"]}></div>
                }
                {
                    whichBlock === 5 ?
                        <div className={style["red-block-RED"]}></div> :
                        <div className={style["block-RED"]}></div>
                }
                {
                    whichBlock === 6 ?
                        <div className={style["red-block-RED"]}></div> :
                        <div className={style["block-RED"]}></div>
                }
            </div>
            <div className={style["line-RED"]}>
                {
                    whichBlock === 1 ?
                        <div className={style["red-block-RED"]}></div> :
                        <div className={style["block-RED"]}></div>
                }
                {
                    whichBlock === 2 ?
                        <div className={style["red-block-RED"]}></div> :
                        <div className={style["block-RED"]}></div>
                }
                {
                    whichBlock === 3 ?
                        <div className={style["red-block-RED"]}></div> :
                        <div className={style["block-RED"]}></div>
                }
            </div>
        </div>
    }
    else if(game === "ORANGE") {
        gameContent = <div id={style["game-container-ORANGE"]} onMouseDown={downScore_ORANGE}>
            <img
                src={orangeIcon}
                alt="target"
                style={{
                    left: `${targetW}vw`,
                    top: `${targetH}vh`,
                    display: `${showTarget ? 'inline-block' : 'none'}`
                }}
                id={style["target-ORANGE"]}
                onMouseDown={(event) => {
                    event.stopPropagation();
                    getScore_ORANGE();
                }}
            />
        </div>
    }
    else if(game === "YELLOW") {
        gameContent = <div id={style["game-container-YELLOW"]}>
            {lines_YELLOW}
        </div>
    }
    else if(game === "GREEN") {
        gameContent = <div id={style["game-container-GREEN"]}>
            <span className={style["score-container-GREEN"]}>
            </span>
            <span
                id={style["circle-container-GREEN"]}
                onClick={click_GREEN}
            ></span>
            <span className={style["score-container-GREEN"]}>
            </span>
        </div>
    }
    else if(game === "SKYBLUE") {
        gameContent = <div id={style["game-container-SKYBLUE"]}>
        <div id={style["arrow-container-SKYBLUE"]}>
            {arrows.map((dict) =>
                <img
                    src={
                        dict.direction === 0 && dict.correct === 1 ? skyblueUpIcon :
                        dict.direction === 1 && dict.correct === 1 ? skyblueDownIcon :
                        dict.direction === 0 ? skyblueIncorrectUpIcon : skyblueIncorrectDownIcon
                    }
                    className={style["arrow-SKYBLUE"]}
                    style={{ left: `${dict.left}vh` }}
                    alt={dict.direction === 0 ? "up-icon" : "down-icon"}
                />
            )}
            <div id={style["here-container-SKYBLUE"]}></div>
        </div>
    </div>
    }
    else if(game === "BLUE") {
        gameContent = <div id={style["game-container-BLUE"]}>
            <div id={style["wheel-container-BLUE"]}>
                <img
                    src={blueWheelIcon}
                    id={style["wheel-BLUE"]}
                    style={{
                        width: wheelSize + "vh",
                        left: (-1) * wheelSize / 2 + "vh",
                        top: (-1) * wheelSize / 2 + "vh",
                        transform:" rotate(" + wheelRotate + "deg" + ")"
                    }}
                    alt={"wheel-icon"}
                />
                <img
                    src={blueDirectionIcon}
                    id={style["direction-BLUE"]}
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
    }
    else if(game === "PURPLE") {
        gameContent = <div id={style["game-container-PURPLE"]}>
            {
                direction === 0 ? "" :
                <img
                    src={
                        direction === 1 ? purpleForwardUpIcon :
                        direction === 2 ? purpleForwardRightIcon :
                        direction === 3 ? purpleForwardDownIcon :
                        direction === 4 ? purpleForwardLeftIcon :
                        direction === 5 ? purpleBackwardUpIcon :
                        direction === 6 ? purpleBackwardRightIcon :
                        direction === 7 ? purpleBackwardDownIcon :
                        purpleBackwardLeftIcon
                    }
                    id={style["direction-PURPLE"]}
                    alt={"direction-icon"}
                />
            }
        </div>
    }
    else if(game === "PINK") {
        gameContent = <div id={style["game-container-PINK"]}>
            <div id={style["alphabet-container-PINK"]} className={colorStyle["white-font"]}>
                { String.fromCharCode(alphabet) }
            </div>
        </div>
    }

    // 페이지 입장, 퇴장 시에 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== null) {
            setCurrentMusic(null);
            setCurrentMusicVolume(1);
        }

        setTheme("DARK");

        return () => {
            stopGameStartSound();
            stopGameOverSound();
        };

    }, [stopGameStartSound, stopGameOverSound]);

    // 다크 테마 유지
    useEffect(() => {

        if (theme !== "DARK") {
            setTheme("DARK");
        }

    }, [theme]);

    // 카운트다운
    useEffect(() => {

        if (step === "PLAY" && countDown > 0) {
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
            setRemaining(0);
        }

    }, [countDown]);

    // 현재 게임 종료
    useEffect(() => {

        if (remaining <= 0) {
            let gameIndex = null;
            
            do {
                gameIndex = Math.floor(Math.random() * 8);
            } while(games[gameIndex].name === game);
            
            if(games[gameIndex].name === "RED") {
                setWhichBlock(Math.floor(Math.random() * 9) + 1);
            }
            else if(games[gameIndex].name === "ORANGE") {
                setShowTarget(true);    // 과녁 등장

                let randomW = Math.floor(Math.random() * 60) + 6;       // 6 ~ 65
                let randomH = Math.floor(Math.random() * 58) + 13;      // 13 ~ 70

                // 과녁 위치 초기화
                setTargetW(randomW);
                setTargetH(randomH);
            }
            else if(games[gameIndex].name === "YELLOW") {
                const newPlayerLocation = Math.floor(Math.random() * 49) + 1;
                let newTargetLocation;

                do {
                    newTargetLocation = Math.floor(Math.random() * 49) + 1;
                } while (newPlayerLocation === newTargetLocation);

                setPlayerLocation(newPlayerLocation);
                setTargetLocation(newTargetLocation);
            }
            else if(games[gameIndex].name === "SKYBLUE") {
                setArrowIndex(0);
                setArrows(Array.from({ length: arrowNumber }, (_, index) => ({
                        left: index * arrowMargin,
                        direction: Math.floor(Math.random() * 2),
                        correct: 1
                    }))
                );
            }
            else if(games[gameIndex].name === "BLUE") {
                setDirectionIndex(Math.floor(Math.random() * 7) + 1);
            }
            else if(games[gameIndex].name === "PURPLE") {
                setDirection(Math.floor(Math.random() * 8) + 1);
            }
            else if(games[gameIndex].name === "PINK") {
                setAlphabet(Math.floor(Math.random() * 26) + 65);
            }

            setGame(games[gameIndex].name);
            setRemaining(games[gameIndex].volume);

            if (isPlaySound) playChangeSound();    // 효과음
        }

    }, [isPlaySound, remaining]);

    // RED: 키보드 입력 처리 함수
    const handleKeyDown_RED = useCallback((event) => {

        if (whichBlock.toString() === event.key && event.location === 3) {
            setScore(score + 1);
            setWhichBlock(Math.floor(Math.random() * 9) + 1);
            setRemaining(remaining - 1);
            if (isPlaySound) playScoreSound();
        }
        else if (whichBlock.toString() !== event.key && event.location === 3) {
            setScore(score - 1);
            setWhichBlock(Math.floor(Math.random() * 9) + 1);
            setRemaining(remaining - 1);
            if (isPlaySound) playWrongSound();
        }

    }, [score, isPlaySound, whichBlock]);

    // ORANGE: 과녁 클릭 성공 처리 함수
    function getScore_ORANGE() {
        if (step === "PLAY" && countDown === "Game start") {
            setScore(score + 1);                                // 점수 + 1
            if (isPlaySound) playScoreSound();                  // 효과음
            setRemaining(remaining - 1);

            let randomW = Math.floor(Math.random() * 60) + 5;       // 6 ~ 65
            let randomH = Math.floor(Math.random() * 58) + 13;      // 13 ~ 70

            // 과녁 위치 초기화
            setTargetW(randomW);
            setTargetH(randomH);
        }
    }

    // ORANGE: 과녁 클릭 실패 처리 함수
    function downScore_ORANGE() {
        if (step === "PLAY" && countDown === "Game start") {
            setScore(score - 1);                  // 점수 - 1
            if (isPlaySound) playWrongSound();    // 효과음
        }
    }

    // YELLOW: 키보드 입력 처리 함수
    const handleKeyDown_YELLOW = useCallback((event) => {
        let newPlayerLocation = playerLocation;

        // 왼쪽 방향키
        if ((event.key === 36 || event.key === "ArrowLeft") && (playerLocation - 1) % 7 !== 0) {
            newPlayerLocation = playerLocation - 1;
            if (isPlaySound) playMoveSound();
        }
        // 오른쪽 방향키
        else if ((event.key === 37 || event.key === "ArrowRight") && playerLocation % 7 !== 0) {
            newPlayerLocation = playerLocation + 1;
            if (isPlaySound) playMoveSound();
        }
        // 위쪽 방향키
        else if ((event.key === 38 || event.key === "ArrowUp") && playerLocation >= 8) {
            newPlayerLocation = playerLocation - 7;
            if (isPlaySound) playMoveSound();
        }
        // 아래쪽 방향키
        else if ((event.key === 39 || event.key === "ArrowDown") && playerLocation <= 42) {
            newPlayerLocation = playerLocation + 7;
            if (isPlaySound) playMoveSound();
        }

        setPlayerLocation(newPlayerLocation);

        // 플레이어가 목표에 도달했을 때 처리
        if (newPlayerLocation === targetLocation) {
            setScore(score + 1);
            setRemaining(remaining - 1);

            if (isPlaySound) playScoreSound();

            let newTargetLocation;

            do {
                newTargetLocation = Math.floor(Math.random() * 49) + 1;
            } while (newPlayerLocation === newTargetLocation);

            setTargetLocation(newTargetLocation);
        }

    }, [isPlaySound, score, playerLocation, targetLocation]);

    // GREEN: 원 클릭
    function click_GREEN() {
        setScore(score + 5);                    // 점수 반영
        setRemaining(remaining - 1);
        if (isPlaySound) playScoreSound();      // 초록색 원 클릭 효과음
    }

    // SKYBLUE: 키보드 입력 처리 함수
    const handleKeyDown_SKYBLUE = useCallback((event) => {

        let isCorrect = null;

        if(event.key === 38 || event.key === "ArrowUp" || event.key === 39 || event.key === "ArrowDown") {
            // 위쪽 방향키
            if (event.key === 38 || event.key === "ArrowUp") {
                if(arrows[arrowIndex].direction === 0) {
                    setScore(score + 1);
                    isCorrect = 1;
                    if (isPlaySound) playScoreSound();
                }
                else {
                    setScore(score - 1);
                    isCorrect = 0;
                    if (isPlaySound) playWrongSound();
                }
            }
            // 아래쪽 방향키
            else if (event.key === 39 || event.key === "ArrowDown") {
                if(arrows[arrowIndex].direction === 1) {
                    setScore(score + 1);
                    isCorrect = 1;
                    if (isPlaySound) playScoreSound();
                }
                else {
                    setScore(score - 1);
                    isCorrect = 0;
                    if (isPlaySound) playWrongSound();
                }
            }

            // 화살표 재정렬
            setArrows((prevArrows) => {
                return prevArrows.map((dict, index) => {
                    if(index === arrowIndex) {
                        return {
                            ...dict,
                            left: dict.left - arrowMargin,
                            correct: isCorrect 
                        }
                    }
                    else {
                        return {
                            ...dict,
                            left: dict.left - arrowMargin
                        }
                    }
                })
            });
    
            // 화살표 index 변경
            if(arrowIndex < arrowNumber - 1)
                setArrowIndex(arrowIndex + 1);
            else
                setArrowIndex(0);

            setRemaining(remaining - 1);

        }

    }, [arrowIndex, arrows, isPlaySound]);

    // BLUE: 키보드 입력 처리 함수
    const handleKeyDown_BLUE = useCallback((event) => {

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

            if (isPlaySound) playMoveSound();
        }
        // 점수 제어 (스페이스 바)
        else if(event.key === 32 || event.key === " " || event.key === "Spacebar") {

            if(directionIndex === 0) {
                setScore(score + 1);
                setRemaining(remaining - 1);
                setDirectionIndex(Math.floor(Math.random() * 7) + 1);
                if (isPlaySound) playScoreSound();
            }
            else {
                setScore(score - 1);
                if (isPlaySound) playWrongSound();
            }

        }

    }, [score, isPlaySound, directionIndex]);

    // PURPLE: 키보드 입력 처리 함수
    const handleKeyDown_PURPLE = useCallback((event) => {

        const currentDirection = direction;
        let nextDirection = null;

        // 왼쪽 방향키
        if (event.key === 36 || event.key === "ArrowLeft") {
            if(direction === 4 || direction === 6) {
                setScore(score + 1);
                if (isPlaySound) playScoreSound();
            }
            else {
                setScore(score - 1);
                if (isPlaySound) playWrongSound();
            }
        }
        // 오른쪽 방향키
        else if (event.key === 37 || event.key === "ArrowRight") {
            if(direction === 2 || direction === 8) {
                setScore(score + 1);
                if (isPlaySound) playScoreSound();
            }
            else {
                setScore(score - 1);
                if (isPlaySound) playWrongSound();
            }
        }
        // 위쪽 방향키
        else if (event.key === 38 || event.key === "ArrowUp") {
            if(direction === 1 || direction === 7) {
                setScore(score + 1);
                if (isPlaySound) playScoreSound();
            }
            else {
                setScore(score - 1);
                if (isPlaySound) playWrongSound();
            }
        }
        // 아래쪽 방향키
        else if (event.key === 39 || event.key === "ArrowDown") {
            if(direction === 3 || direction === 5) {
                setScore(score + 1);
                if (isPlaySound) playScoreSound();
            }
            else {
                setScore(score - 1);
                if (isPlaySound) playWrongSound();
            }
        }
        else {
            nextDirection = "this is not arrow key";
        }

        if(nextDirection === null) {
            do {
                nextDirection = Math.floor(Math.random() * 8) + 1;
            } while(currentDirection === nextDirection);
                
            setRemaining(remaining - 1);
            console.log(remaining);
            setDirection(nextDirection);
        }

    }, [score, isPlaySound, direction]);

    // PINK: 키보드 입력 처리 함수
    const handleKeyDown_PINK = useCallback((event) => {

        if(event.key.charCodeAt(0) >= 97 && event.key.charCodeAt(0) <= 122) {
            if (alphabet === (event.key.charCodeAt(0) - 32)) {
                setScore(score + 1);
                setRemaining(remaining - 1);
                setAlphabet(Math.floor(Math.random() * 26) + 65);
                if (isPlaySound) playScoreSound();
            }
            else {
                setScore(score - 1);
                setRemaining(remaining - 1);
                setAlphabet(Math.floor(Math.random() * 26) + 65);
                if (isPlaySound) playWrongSound();
            }
        }

    }, [score, isPlaySound, alphabet]);

    // 게임 진행 중
    useEffect(() => {

        if(game === "RED") {

            // 게임 진행 중이면, 키보드 입력 이벤트마다 함수 호출
            if (step === "PLAY" && countDown === "Game start") {
                window.addEventListener("keydown", handleKeyDown_RED);
            }
            else {
                window.removeEventListener("keydown", handleKeyDown_RED);
            }

            // 이벤트 리스너 제거
            return () => {
                window.removeEventListener("keydown", handleKeyDown_RED);
            };

        }
        else if(game === "YELLOW") {
            // 게임 진행 중이면, 키보드 입력 이벤트마다 함수 호출
            if (step === "PLAY" && countDown === "Game start") {
                window.addEventListener("keydown", handleKeyDown_YELLOW);
            }
            else {
                window.removeEventListener("keydown", handleKeyDown_YELLOW);
            }

            // 이벤트 리스너 제거
            return () => {
                window.removeEventListener("keydown", handleKeyDown_YELLOW);
            };
        }
        else if(game === "SKYBLUE") {
            // 게임 진행 중이면, 키보드 입력 이벤트마다 함수 호출
            if (step === "PLAY" && countDown === "Game start") {
                window.addEventListener("keydown", handleKeyDown_SKYBLUE);
            }
            else {
                window.removeEventListener("keydown", handleKeyDown_SKYBLUE);
            }

            // 이벤트 리스너 제거
            return () => {
                window.removeEventListener("keydown", handleKeyDown_SKYBLUE);
            };
        }
        else if(game === "BLUE") {
            // 게임 진행 중이면, 키보드 입력 이벤트마다 함수 호출
            if (step === "PLAY" && countDown === "Game start") {
                window.addEventListener("keydown", handleKeyDown_BLUE);
            }
            else {
                window.removeEventListener("keydown", handleKeyDown_BLUE);
            }

            // 이벤트 리스너 제거
            return () => {
                window.removeEventListener("keydown", handleKeyDown_BLUE);
            };
        }
        else if(game === "PURPLE") {
            // 게임 진행 중이면, 키보드 입력 이벤트마다 함수 호출
            if (step === "PLAY" && countDown === "Game start") {
                window.addEventListener("keydown", handleKeyDown_PURPLE);
            }
            else {
                window.removeEventListener("keydown", handleKeyDown_PURPLE);
            }

            // 이벤트 리스너 제거
            return () => {
                window.removeEventListener("keydown", handleKeyDown_PURPLE);
            };
        }
        else if(game === "PINK") {
            // 게임 진행 중이면, 키보드 입력 이벤트마다 함수 호출
            if (step === "PLAY" && countDown === "Game start") {
                window.addEventListener("keydown", handleKeyDown_PINK);
            }
            else {
                window.removeEventListener("keydown", handleKeyDown_PINK);
            }

            // 이벤트 리스너 제거
            return () => {
                window.removeEventListener("keydown", handleKeyDown_PINK);
            };
        }
        else {
            window.removeEventListener("keydown", handleKeyDown_RED);
            window.removeEventListener("keydown", handleKeyDown_YELLOW);
            window.removeEventListener("keydown", handleKeyDown_SKYBLUE);
            window.removeEventListener("keydown", handleKeyDown_BLUE);
            window.removeEventListener("keydown", handleKeyDown_PURPLE);
            window.removeEventListener("keydown", handleKeyDown_PINK);
        }

    }, [score, isPlaySound, step, game, playerLocation, directionIndex]);

    // 게임 종료
    useEffect(() => {
        if (step === "OVER" && score > 0) {
            const getResult = async () => {

                await refreshAccessToken();

                try {
                    await sendApi(
                        '/api/game/insert-score',
                        "POST",
                        true,
                        {
                            "game": "Black",
                            "score": score
                        }
                    );
                }
                catch {}
                finally {
                    try {
                        const response = await sendApi(
                            '/api/game/result',
                            "GET",
                            false,
                            {
                                "game": "Black",
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
        else if(step === "OVER" && score <= 0) {
            if (isPlaySound) playGameOverSound();    // 게임 종료 효과음
            setStep("RESULT");
        }
    }, [step]);

    // 게임 시작 버튼
    function play() {
        setStep("PLAY");
        setCurrentMusic(blackBackgroundMusic);
        setCurrentMusicVolume(0.32);
    }

    // 재시도 버튼
    function retry() {
        setStep("READY");
        setCurrentMusic(null);
        setCurrentMusicVolume(1);

        setCountDown(3);
        setStopwatch(60);
        setScore(0);
        setCountAll(0);
        setRank(0);
        setPercentile(0);

        // RED
        setGame();
        setRemaining();
        setWhichBlock(10);
        // ORANGE
        setShowTarget(false);
        // YELLOW
        setPlayerLocation(99);
        setTargetLocation(99);
        // SKYBLUE
        setArrowIndex(0);
        setArrows(Array.from({ length: arrowNumber }, (_, index) => ({
            left: index * arrowMargin,
            direction: 2,
            correct: 1
        })));
        // BLUE
        setDirectionIndex(0);
        setWheelRotate(0);
        // PURPLE
        setDirection(0);
        // PINK
        setAlphabet();
    }

    if (step === "READY") {
        content = <div id={gameStyle["container"]}>
            <HowToPlay
                title="Black"
                iconSource={blackIcon}
                iconSize={"12vh"}
                description={
                    <div>
                        <b>최선을 다하세요.</b><br />
                    </div>
                }
                stopwatch="60초"
            />
            <div id={gameStyle["start-button"]} className={colorStyle["black-background"]} style={{"border": "0.3vh solid #FFFFFF"}} onClick={play} >
                Start
            </div>
        </div>
    }
    else if (step === "PLAY") {
        content = <div id={gameStyle["container"]}>
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
            {gameContent}
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
                game="Black"
                fontColor="white-font"
                score={score}
                countAll={countAll}
                rank={rank}
                percentile={percentile}
                isValid={score > 0}
            />
            <div id={gameStyle["start-button"]} className={colorStyle["black-background"]} style={{"border": "0.3vh solid #FFFFFF"}} onClick={retry} >
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

export default BlackGamePage;