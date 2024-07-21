import React, { useState, useEffect, useContext, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import useSound from 'use-sound';
import { sendApi, refreshAccessToken } from '../../util/apiUtil.js';

import HowToPlay from '../../component/HowToPlay';
import Result from '../../component/Result';
import WaitServer from '../../component/WaitServer.js';
import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './PurpleStyle.module.css';
import gameStyle from './GameStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import animationStyle from '../../App.module.css';

import purpleIcon from '../../image/purple-icon.svg';
import forwardLeftIcon from '../../image/purple-left-forward-icon.svg';
import forwardRightIcon from '../../image/purple-right-forward-icon.svg';
import forwardUpIcon from '../../image/purple-up-forward-icon.svg';
import forwardDownIcon from '../../image/purple-down-forward-icon.svg';
import backwardLeftIcon from '../../image/purple-left-backward-icon.svg';
import backwardRightIcon from '../../image/purple-right-backward-icon.svg';
import backwardUpIcon from '../../image/purple-up-backward-icon.svg';
import backwardDownIcon from '../../image/purple-down-backward-icon.svg';
import score_sound from '../../sound/red_score_sound.mp3';
import wrong_sound from '../../sound/red_wrong_sound.mp3';
import countDown_sound from '../../sound/countDown_sound.mp3';
import gameStart_sound from '../../sound/gameStart_sound.mp3';
import gameOver_sound from '../../sound/gameOver_sound.mp3';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';
import purpleBackgroundMusic from '../../sound/purple_background_music.mp3';

function PurpleGamePage() {

    let content = null;

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

    const [direction, setDirection] = useState(0);          // 방향

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
            setDirection(Math.floor(Math.random() * 8) + 1);
        }

    }, [countDown]);

    // 키보드 입력 처리 함수
    const handleKeyDown = useCallback((event) => {

        const currentDirection = direction;
        let nextDirection = null;

        console.log(direction);

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
            } while(currentDirection === nextDirection)
                
            setDirection(nextDirection);
        }

    }, [score, isPlaySound, direction]);

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

    }, [score, isPlaySound, step, direction]);

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
                            "game": "Purple",
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
                                "game": "Purple",
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
        setCurrentMusic(purpleBackgroundMusic);
        setCurrentMusicVolume(0.5);
    }

    // 재시도 버튼
    function retry() {
        setStep("READY");
        setCurrentMusic(homeBackgroundMusic);
        setCurrentMusicVolume(1);

        setCountDown(3);
        setStopwatch(30);
        setScore(0);
        setCountAll(0);
        setRank(0);
        setPercentile(0);

        setDirection(0);
    }

    if (step === "READY") {
        content = <div id={gameStyle["container"]}>
            <HowToPlay
                title="Purple"
                iconSource={purpleIcon}
                iconSize={"13vh"}
                description={
                    <div>
                        키보드의 방향키를 사용합니다.<br />
                        방향키는 <b className={colorStyle["purple-font"]}>가운데 원이 뚫린 방향</b>을 기준으로 눌러야 합니다.<br />
                        만약, <b>가운데 원이 보라색으로 채워져있다면,</b> 뚫린 방향의 방향키를 누릅니다.<br />
                        그러나, <b>가운데 원이 비어져있다면,</b> 뚫린 방향의 반대쪽의 방향키를 누릅니다.<br />
                    </div>
                }
                stopwatch="30초"
            />
            <div id={gameStyle["start-button"]} className={colorStyle["purple-background"]} onClick={play} >
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
                {
                    direction === 0 ? "" :
                    <img
                        src={
                            direction === 1 ? forwardUpIcon :
                            direction === 2 ? forwardRightIcon :
                            direction === 3 ? forwardDownIcon :
                            direction === 4 ? forwardLeftIcon :
                            direction === 5 ? backwardUpIcon :
                            direction === 6 ? backwardRightIcon :
                            direction === 7 ? backwardDownIcon :
                            backwardLeftIcon
                        }
                        id={style["direction"]}
                        alt={"direction-icon"}
                    />
                }
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
                game="Purple"
                fontColor="purple-font"
                score={score}
                countAll={countAll}
                rank={rank}
                percentile={percentile}
                isValid={score > 0}
            />
            <div id={gameStyle["start-button"]} className={colorStyle["purple-background"]} onClick={retry} >
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

export default PurpleGamePage;