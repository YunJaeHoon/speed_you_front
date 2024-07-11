import React, { useState, useEffect, useContext, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import useSound from 'use-sound';
import { sendApi, refreshAccessToken } from '../../util/apiUtil.js';

import HowToPlay from '../../component/HowToPlay';
import Result from '../../component/Result';
import WaitServer from '../../component/WaitServer.js';
import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './SkyblueStyle.module.css';
import gameStyle from './GameStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import animationStyle from '../../App.module.css';

import skyblueIcon from '../../image/skyblue-icon.svg';
import upIcon from '../../image/skyblue-up-icon.svg';
import incorrectUpIcon from '../../image/skyblue-up-incorrect-icon.svg';
import downIcon from '../../image/skyblue-down-icon.svg';
import incorrectDownIcon from '../../image/skyblue-down-incorrect-icon.svg';
import unavailableIcon from '../../image/skyblue-unavailable-icon.svg';
import score_sound from '../../sound/red_score_sound.mp3';
import wrong_sound from '../../sound/red_wrong_sound.mp3';
import countDown_sound from '../../sound/countDown_sound.mp3';
import gameStart_sound from '../../sound/gameStart_sound.mp3';
import gameOver_sound from '../../sound/gameOver_sound.mp3';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';
import skyblueBackgroundMusic from '../../sound/skyblue_background_music.mp3';

function SkyblueGamePage() {

    let content = null;
    const arrowNumber = 30;     // 화살표 개수
    const arrowMargin = 13;     // 화살표 간의 간격

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
    
    const [arrowIndex, setArrowIndex] = useState(0);        // 현재 화살표 index

    // 화살표 정보
    const [arrows, setArrows] = useState(Array.from({ length: arrowNumber }, (_, index) => ({
        left: index * arrowMargin,
        direction: 2,
        correct: 1
    })));

    // 효과음
    const [playScoreSound] = useSound(score_sound, { volume: 0.4 });
    const [playWrongSound] = useSound(wrong_sound, { volume: 1 });
    const [playCountDownSound] = useSound(countDown_sound, { volume: 0.35 });
    const [playGameStartSound, { stop: stopGameStartSound }] = useSound(gameStart_sound, { volume: 0.7 });
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
            setArrows((prevArrows) => 
                prevArrows.map(dict => ({
                    ...dict,
                    direction: Math.floor(Math.random() * 2)
                }))
            );
        }

    }, [countDown]);

    // 키보드 입력 처리 함수
    const handleKeyUp = useCallback((event) => {

        let isCorrect = null;

        if(event.key === 38 || event.key === "ArrowUp" || event.key === 39 || event.key === "ArrowDown") {
            // 위쪽 방향키
            if (event.key === 38 || event.key === "ArrowUp") {
                if(arrows[arrowIndex].direction == 0) {
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
                if(arrows[arrowIndex].direction == 1) {
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
                    else if(dict.left <= (-1) * arrowMargin * (arrowNumber / 2)) {
                        return {
                            direction: Math.floor(Math.random() * 2),
                            left: arrowMargin * (arrowNumber / 2 - 1),
                            correct: 1
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

        }

    }, [arrowIndex, arrows, isPlaySound]);

    // 게임 진행 중
    useEffect(() => {

        // 게임 진행 중이면, 키보드 입력 이벤트마다 함수 호출
        if (step === "PLAY" && countDown === "Game start") {
            window.addEventListener("keyup", handleKeyUp);
        }
        else {
            window.removeEventListener("keyup", handleKeyUp);
        }

        // 이벤트 리스너 제거
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };

    }, [score, isPlaySound, step, arrowIndex, arrows]);

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
                            "game": "Skyblue",
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
                                "game": "Skyblue",
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
        setCurrentMusic(skyblueBackgroundMusic);
        setCurrentMusicVolume(0.15);
    }

    // 재시도 버튼
    function retry() {
        setStep("READY");
        setCurrentMusic(homeBackgroundMusic);
        setCurrentMusicVolume(1);

        setCountDown(3);
        setStopwatch(30);
        setScore(0);

        setArrowIndex(0);
        setArrows(Array.from({ length: arrowNumber }, (_, index) => ({
            left: index * arrowMargin,
            direction: 2,
            correct: 1
        })));
    }

    if (step === "READY") {
        content = <div id={gameStyle["container"]}>
            <HowToPlay
                title="Skyblue"
                iconSource={skyblueIcon}
                iconSize={"12vh"}
                description={
                    <div>
                        방향키의 상(▲), 하(▼) 키를 이용합니다.<br />
                        화면 가운데의 <b className={colorStyle["skyblue-font"]}>하늘색</b> 화살표 방향에 알맞는 방향키를 누르세요.<br />
                        잘못된 방향키를 누르면 점수가 차감됩니다.<br />
                    </div>
                }
                stopwatch="30초"
            />
            <div id={gameStyle["start-button"]} className={colorStyle["skyblue-background"]} onClick={play} >
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
            <div id={style["game-container"]}>
                <div id={style["arrow-container"]}>
                    {arrows.map((dict) =>
                        <img
                            src={
                                dict.direction === 2 ? unavailableIcon :
                                dict.direction === 0 && dict.correct === 1 ? upIcon :
                                dict.direction === 1 && dict.correct === 1 ? downIcon :
                                dict.direction === 0 ? incorrectUpIcon : incorrectDownIcon
                            }
                            className={style["arrow"]}
                            style={{ left: `${dict.left}vh` }}
                            alt={dict.direction === 0 ? "up-icon" : "down-icon"}
                        />
                    )}
                    <div
                        id={style["here-container"]}
                        style={theme === "LIGHT" ? {border: "0.3vh solid #20201E"} : {border: "0.3vh solid #FFFFFF"} }
                    >
                    </div>
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
                game="Skyblue"
                fontColor="skyblue-font"
                score={score}
                countAll={countAll}
                rank={rank}
                percentile={percentile}
            />
            <div id={gameStyle["start-button"]} className={colorStyle["skyblue-background"]} onClick={retry} >
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

export default SkyblueGamePage;