import React, { useState, useEffect, useContext, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import useSound from 'use-sound';
import { sendApi, refreshAccessToken } from '../../util/apiUtil.js';

import HowToPlay from '../../component/HowToPlay';
import Result from '../../component/Result';
import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './GreenStyle.module.css';
import gameStyle from './GameStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import animationStyle from '../../App.module.css';

import greenIcon from '../../image/green-icon.svg';
import score_sound from '../../sound/red_score_sound.mp3';
import wrong_sound from '../../sound/red_wrong_sound.mp3';
import countDown_sound from '../../sound/countDown_sound.mp3';
import gameStart_sound from '../../sound/gameStart_sound.mp3';
import gameOver_sound from '../../sound/gameOver_sound.mp3';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';
import greenBackgroundMusic from '../../sound/green_background_music.mp3';
import WaitServer from '../../component/WaitServer.js';

function GreenGamePage() {

    let content = null;   // 시간을 측정하기 시작한 시간

    // context
    const { isPlaySound, currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [step, setStep] = useState("READY");                  // 게임 절차
    const [countDown, setCountDown] = useState(3);              // 카운트다운
    const [stopwatch, setStopwatch] = useState(0);              // 시간 측정
    const [score, setScore] = useState(0);                      // 점수
    const [countAll, setCountAll] = useState(0);                // 전체 결과 개수
    const [rank, setRank] = useState(0);                        // 순위
    const [percentile, setPercentile] = useState(0);            // 상위 퍼센트

    const [round, setRound] = useState(1);                          // 라운드
    const [score_1, setScore_1] = useState(".");                    // 1라운드 점수
    const [score_2, setScore_2] = useState(".");                    // 2라운드 점수
    const [score_3, setScore_3] = useState(".");                    // 3라운드 점수
    const [score_4, setScore_4] = useState(".");                    // 4라운드 점수
    const [score_5, setScore_5] = useState(".");                    // 5라운드 점수
    const [circleActivate, setCircleActivate] = useState(false);    // 원 활성화 여부
    const [startTime, setStartTime] = useState(null);               // 시간을 측정하기 시작한 시간

    const [waitId, setWaitId] = useState(null);                 // activateCircle 함수 호출 전, 일정 시간 기다리는 setTimeout
    const [randomWaitId, setRandomWaitId] = useState(null);     // 랜덤 시간 기다리는 setTimeout
    const [stopwatchId, setStopwatchId] = useState(null);       // 시간을 측정하는 requestAnimationFrame

    const setScoreList = [setScore_1, setScore_2, setScore_3, setScore_4, setScore_5];

    // 효과음
    const [playScoreSound] = useSound(score_sound, { volume: 0.5 });
    const [playWrongSound] = useSound(wrong_sound);
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
            if (isPlaySound) playCountDownSound();                  // 카운트다운 효과음
        }
        else if (step === "PLAY" && countDown === 0) {
            setCountDown("Game start");                 // 카운트다운 종료
            if (isPlaySound) playGameStartSound();      // 게임 시작 효과음
        }

    }, [step, countDown]);

    // 게임 시작
    useEffect(() => {

        if (countDown === "Game start") {

            // 기다림 종료
            if (waitId) {
                clearTimeout(waitId);
                setWaitId(null);
            }
            if (randomWaitId) {
                clearTimeout(randomWaitId);
                setRandomWaitId(null);
            }

            setWaitId(setTimeout(waitRandomNumber, 3000));        // 3초 delay
        }

    }, [countDown]);

    // 랜덤 수만큼 기다렸다가, activateCircle 함수 호출
    function waitRandomNumber() {
        const randomNumber = Math.floor(Math.random() * 5000);      // 0 ~ 4999
        setRandomWaitId(setTimeout(activateCircle, randomNumber));  // 랜덤 수만큼 delay
    }

    // 원 활성화
    function activateCircle() {
        setCircleActivate(true);        // 원 활성화
    }

    // 시간 측정
    useEffect(() => {

        setStopwatch(0);

        if (step === "PLAY" && circleActivate) {
            setStartTime(Date.now());
        }
        else {
            setStartTime("round-finish");
        }

    }, [step, circleActivate]);

    useEffect(() => {

        setStopwatch(0);

        if (step === "PLAY" && circleActivate && startTime) {
            updateStopwatch();
        }

    }, [step, circleActivate, startTime]);

    function updateStopwatch() {
        if(startTime !== "round-finish") {
            const currentTime = Date.now();

            setStopwatch(currentTime - startTime);                      // 경과 시간을 스톱워치에 반영
            setStopwatchId(requestAnimationFrame(updateStopwatch));     // 다음 애니메이션 프레임에 업데이트
        }
        else {
            setStopwatch(0);
        }
    }

    // 초록색 원 클릭
    function clickGreen() {
        setCircleActivate(false);               // 원 비활성화
        setScore(score + stopwatch);            // 점수 반영
        setScoreList[round-1](stopwatch);       // 라운드 점수 등록
        if (isPlaySound) playScoreSound();      // 초록색 원 클릭 효과음

        // 스톱워치 중단
        if (stopwatchId) {
            cancelAnimationFrame(stopwatchId);
            setStopwatchId(null);
        }

        setStopwatch(0);
        
        if(round === 5) {
            setTimeout(() => { setStep("OVER"); }, 1200);       // 1.2초 후, 게임 종료
        }
        else {
            setRound(round + 1);                                // 라운드 증가
            setWaitId(setTimeout(waitRandomNumber, 3000));      // 3초 delay
        }
    }

    // 원이 초록색이 되기 전에 클릭
    function clickWhite() {

        // 기다림 종료
        if (waitId) {
            clearTimeout(waitId);
            setWaitId(null);
        }
        if (randomWaitId) {
            clearTimeout(randomWaitId);
            setRandomWaitId(null);
        }

        // 스톱워치 중단
        if (stopwatchId) {
            cancelAnimationFrame(stopwatchId);
            setStopwatchId(null);
            setStopwatch(0);
        }

        if (isPlaySound) playWrongSound();      // 원이 초록색이 되기 전 클릭 효과음
        
        setScore(0);        // 점수 초기화
        setScore_1(".");    // 1라운드 점수 초기화
        setScore_2(".");    // 2라운드 점수 초기화
        setScore_3(".");    // 3라운드 점수 초기화
        setScore_4(".");    // 4라운드 점수 초기화
        setScore_5(".");    // 5라운드 점수 초기화
        setRound(1);        // 라운드 초기화
        setWaitId(setTimeout(waitRandomNumber, 3000));  // 3초 delay
    }

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
                            "game": "Green",
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
                                "game": "Green",
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
        setCurrentMusic(greenBackgroundMusic);
        setCurrentMusicVolume(1);
    }

    // 재시도 버튼
    function retry() {

        // 기다림 종료
        if (waitId) {
            clearTimeout(waitId);
            setWaitId(null);
        }
        if (randomWaitId) {
            clearTimeout(randomWaitId);
            setRandomWaitId(null);
        }

        // 스톱워치 중단
        if (stopwatchId) {
            cancelAnimationFrame(stopwatchId);
            setStopwatchId(null);
            setStopwatch(0);
        }

        setStep("READY");
        setCurrentMusic(homeBackgroundMusic);
        setCurrentMusicVolume(1);

        setStopwatch(0);
        setCountDown(3);
        setScore(0);

        setRound(1);
        setScore_1(".");
        setScore_2(".");
        setScore_3(".");
        setScore_4(".");
        setScore_5(".");
        setCircleActivate(false);
        setStartTime(null);
    }

    if (step === "READY") {
        content = <div id={gameStyle["container"]}>
            <HowToPlay
                title="Green"
                iconSource={greenIcon}
                iconSize={"13vh"}
                description={
                    <div>
                        화면 한가운데의 원이 <b className={colorStyle["green-font"]}>초록색</b>이 되는 순간 원을 클릭하세요.<br />
                        총 5번의 기회가 주어지며, 점수는 각 도전 결과의 합산으로 측정됩니다.<br />
                        초록색이 되기 전, 원을 누르면 처음부터 다시 시작하니 주의하세요.<br />
                    </div>
                }
                stopwatch="-"
            />
            <div id={gameStyle["start-button"]} className={colorStyle["green-background"]} onClick={play} >
                Start
            </div>
        </div>
    }
    else if (step === "PLAY") {
        content = <div id={gameStyle["container"]}>
            <div id={gameStyle["top-container"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                <div className={gameStyle["top-subcontainer"]}>
                    <div className={gameStyle["information-title"]}>시간</div>
                    <div className={gameStyle["information"]}>{stopwatch / 1000}</div>
                </div>
                <div id={countDown === "Game start" ? gameStyle["game-start"] : gameStyle["count-down"]}>{countDown}</div>
                <div className={gameStyle["top-subcontainer"]}>
                    <div className={gameStyle["information-title"]}>점수</div>
                    <div className={gameStyle["information"]}>{score}</div>
                </div>
            </div>
            <div id={style["game-container"]}>
                <span className={`${style["score-container"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>
                    <div className={style["score-subcontainer"]}>
                        <span className={score_1 === "." ? style["round-ready"] : style["round-end"]}></span>
                        <span className={style["round-score"]}>{score_1 === "." ? "" : score_1 + " ms"}</span>
                    </div>
                    <div className={style["score-subcontainer"]}>
                        <span className={score_2 === "." ? style["round-ready"] : style["round-end"]}></span>
                        <span className={style["round-score"]}>{score_2 === "." ? "" : score_2 + " ms"}</span>
                    </div>
                    <div className={style["score-subcontainer"]}>
                        <span className={score_3 === "." ? style["round-ready"] : style["round-end"]}></span>
                        <span className={style["round-score"]}>{score_3 === "." ? "" : score_3 + " ms"}</span>
                    </div>
                    <div className={style["score-subcontainer"]}>
                        <span className={score_4 === "." ? style["round-ready"] : style["round-end"]}></span>
                        <span className={style["round-score"]}>{score_4 === "." ? "" : score_4 + " ms"}</span>
                    </div>
                    <div className={style["score-subcontainer"]}>
                        <span className={score_5 === "." ? style["round-ready"] : style["round-end"]}></span>
                        <span className={style["round-score"]}>{score_5 === "." ? "" : score_5 + " ms"}</span>
                    </div>
                </span>
                <span
                    id={style["circle-container"]}
                    style={circleActivate ?
                        {backgroundColor : "#20CC20"} :
                        {backgroundColor : "#c5c5c5"}
                    }
                    onClick={circleActivate ? clickGreen : clickWhite }
                ></span>
                <span className={style["score-container"]}>
                </span>
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
                game="Green"
                fontColor="green-font"
                score={score}
                countAll={countAll}
                rank={rank}
                percentile={percentile}
            />
            <div id={gameStyle["start-button"]} className={colorStyle["green-background"]} onClick={retry} >
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

export default GreenGamePage;