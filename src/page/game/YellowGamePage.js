import React, { useState, useEffect, useContext, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import useSound from 'use-sound';
import { sendApi, refreshAccessToken } from '../../util/apiUtil.js';

import HowToPlay from '../../component/HowToPlay';
import Result from '../../component/Result';
import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './YellowStyle.module.css';
import gameStyle from './GameStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import animationStyle from '../../App.module.css';

import yellowIcon from '../../image/yellow-icon.svg';
import score_sound from '../../sound/yellow_score_sound.mp3';
import move_sound from '../../sound/red_score_sound.mp3';
import countDown_sound from '../../sound/countDown_sound.mp3';
import gameStart_sound from '../../sound/gameStart_sound.mp3';
import gameOver_sound from '../../sound/gameOver_sound.mp3';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';
import yellowBackgroundMusic from '../../sound/yellow_background_music.mp3';
import WaitServer from '../../component/WaitServer.js';

function YellowGamePage() {

    let content = null;

    // context
    const { isPlaySound, currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [step, setStep] = useState("READY");                  // 게임 절차
    const [countDown, setCountDown] = useState(3);              // 카운트다운
    const [stopwatch, setStopwatch] = useState(45);             // 제한 시간
    const [score, setScore] = useState(0);                      // 점수
    const [countAll, setCountAll] = useState(0);                // 전체 결과 개수
    const [rank, setRank] = useState(0);                        // 순위
    const [percentile, setPercentile] = useState(0);            // 상위 퍼센트

    const [playerLocation, setPlayerLocation] = useState(99);   // 플레이어 위치
    const [beginLocation, setBeginLocation] = useState(99);     // 플레이어 초기 위치
    const [targetLocation, setTargetLocation] = useState(99);   // 목표 위치

    // 효과음
    const [playScoreSound] = useSound(score_sound, { volume: 0.2 });
    const [playMoveSound] = useSound(move_sound, { volume: 0.3 });
    const [playCountDownSound] = useSound(countDown_sound, { volume: 0.35 });
    const [playGameStartSound, { stop: stopGameStartSound }] = useSound(gameStart_sound, { volume: 0.7 });
    const [playGameOverSound, { stop: stopGameOverSound }] = useSound(gameOver_sound);

    // 49개의 블럭
    const blocks = Array.from({ length: 49 }, (_, index) => {
        const location = index + 1;
        return (
            playerLocation === location ? <div key={location} className={style["player-block"]}></div> :
            targetLocation === location ? <div key={location} className={style["target-block"]}></div> :
            <div key={location} className={style["block"]}></div>
        );
    });

    // 7개씩 묶어 <div>로 감싸기
    const lines = [];
    for (let i = 0; i < blocks.length; i += 7) {
        lines.push(
            <div key={i} className={style["line"]}>
                {blocks.slice(i, i + 7)}
            </div>
        );
    }

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
            if (isPlaySound) playCountDownSound();                    // 카운트다운 효과음
        }
        else if (step === "PLAY" && countDown === 0) {
            setCountDown("Game start");             // 카운트다운 종료
            if (isPlaySound) playGameStartSound();    // 게임 시작 효과음
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

    // 게임 시작 ( 플레이어, 목표 초기 위치 결정 )
    useEffect(() => {

        if (countDown === "Game start") {
            const newPlayerLocation = Math.floor(Math.random() * 49) + 1;
            let newTargetLocation;

            do {
                newTargetLocation = Math.floor(Math.random() * 49) + 1;
            } while (newPlayerLocation === newTargetLocation);

            setPlayerLocation(newPlayerLocation);
            setBeginLocation(newPlayerLocation);
            setTargetLocation(newTargetLocation);
        }

    }, [countDown]);

    // 키보드 입력 처리 함수
    const handleKeyDown = useCallback((event) => {
        let newPlayerLocation = playerLocation;
        console.log(event.key);

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

            const bonusW = Math.abs(((beginLocation % 7 === 0) ? 7 : (beginLocation % 7)) - ((targetLocation % 7 === 0) ? 7 : (targetLocation % 7)));
            const bonusH = Math.abs(Math.floor((beginLocation - 1) / 7) - Math.floor((targetLocation - 1) / 7));
            console.log("w : " + bonusW);
            console.log("h : " + bonusH);

            const bonus = bonusW + bonusH;
            setScore(score + bonus);

            if (isPlaySound) playScoreSound();

            let newTargetLocation;

            do {
                newTargetLocation = Math.floor(Math.random() * 49) + 1;
            } while (newPlayerLocation === newTargetLocation);

            setBeginLocation(newPlayerLocation);
            setTargetLocation(newTargetLocation);
        }

    }, [playerLocation, targetLocation, isPlaySound]);

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

    }, [score, isPlaySound, step, playerLocation]);

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
                            "game": "Yellow",
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
                                "game": "Yellow",
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
        setCurrentMusic(yellowBackgroundMusic);
        setCurrentMusicVolume(0.9);
    }

    // 재시도 버튼
    function retry() {
        setStep("READY");
        setCurrentMusic(homeBackgroundMusic);
        setCurrentMusicVolume(1);

        setCountDown(3);
        setStopwatch(45);
        setScore(0);

        setPlayerLocation(99);
        setBeginLocation(99);
        setTargetLocation(99);
    }

    if (step === "READY") {
        content = <div id={gameStyle["container"]}>
            <HowToPlay
                title="Yellow"
                iconSource={yellowIcon}
                iconSize={"12vh"}
                description={
                    <div>
                        방향키를 이용하여, <b>검정색</b> 블럭을 <b className={colorStyle["yellow-font"]}>노란색</b> 블럭의 위치로 옮기세요.<br />
                        초기 위치와 목표 위치 사이의 거리만큼 점수가 추가됩니다.<br />
                    </div>
                }
                stopwatch="45초"
            />
            <div id={gameStyle["start-button"]} className={colorStyle["yellow-background"]} onClick={play} >
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
                {lines}
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
                game="Yellow"
                fontColor="yellow-font"
                score={score}
                countAll={countAll}
                rank={rank}
                percentile={percentile}
            />
            <div id={gameStyle["start-button"]} className={colorStyle["yellow-background"]} onClick={retry} >
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

export default YellowGamePage;