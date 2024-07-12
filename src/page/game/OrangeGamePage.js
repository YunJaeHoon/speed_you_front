import React, { useState, useEffect, useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import useSound from 'use-sound';
import { sendApi, refreshAccessToken } from '../../util/apiUtil.js';

import HowToPlay from '../../component/HowToPlay';
import Result from '../../component/Result';
import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './OrangeStyle.module.css';
import gameStyle from './GameStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import animationStyle from '../../App.module.css';

import orangeIcon from '../../image/orange-icon.svg';
import score_sound_1 from '../../sound/orange_score1_sound.mp3';
import score_sound_2 from '../../sound/orange_score2_sound.mp3';
import score_sound_3 from '../../sound/orange_score3_sound.mp3';
import score_sound_4 from '../../sound/orange_score4_sound.mp3';
import score_sound_5 from '../../sound/orange_score5_sound.mp3';
import wrong_sound from '../../sound/orange_wrong_sound.mp3';
import countDown_sound from '../../sound/countDown_sound.mp3';
import load_sound from '../../sound/orange_load_sound.mp3';
import gameStart_sound from '../../sound/gameStart_sound.mp3';
import gameOver_sound from '../../sound/gameOver_sound.mp3';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';
import orangeBackgroundMusic from '../../sound/orange_background_music.mp3';
import WaitServer from '../../component/WaitServer.js';

function OrangeGamePage() {

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

    const [showTarget, setShowTarget] = useState(false);    // 과녁 등장 여부
    const [targetW, setTargetW] = useState(0);              // 과녁 가로 마진
    const [targetH, setTargetH] = useState(0);              // 과녁 세로 마진

    // 효과음
    const [playScoreSound_1] = useSound(score_sound_1, { volume: 0.25 });
    const [playScoreSound_2] = useSound(score_sound_2, { volume: 0.25 });
    const [playScoreSound_3] = useSound(score_sound_3, { volume: 0.75 });
    const [playScoreSound_4] = useSound(score_sound_4, { volume: 0.25 });
    const [playScoreSound_5] = useSound(score_sound_5, { volume: 0.15 });
    const [playWrongSound] = useSound(wrong_sound, { volume: 1 });
    const [playLoadSound, { stop: stopLoadSound }] = useSound(load_sound, { volume: 0.4 });
    const [playCountDownSound] = useSound(countDown_sound, { volume: 0.35 });
    const [playGameStartSound, { stop: stopGameStartSound }] = useSound(gameStart_sound, { volume: 0.7 });
    const [playGameOverSound, { stop: stopGameOverSound }] = useSound(gameOver_sound);

    const playScoreSounds = [playScoreSound_1, playScoreSound_2, playScoreSound_3, playScoreSound_4, playScoreSound_5];

    // 페이지 입장, 퇴장 시에 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        return () => {
            stopLoadSound();
            stopGameStartSound();
            stopGameOverSound();
        };

    }, [stopLoadSound, stopGameStartSound, stopGameOverSound]);

    // 카운트다운
    useEffect(() => {

        if (step === "PLAY" && countDown > 0) {

            if (countDown === 3) {
                if (isPlaySound) playLoadSound();    // 장전 소리
            }

            setTimeout(() => setCountDown(countDown - 1), 1500);      // 1.5초마다 감소
            if (isPlaySound) playCountDownSound();                    // 카운트다운 효과음
        }
        else if (step === "PLAY" && countDown === 0) {
            setCountDown("Game start");               // 카운트다운 종료
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

    // 게임 시작 ( 과녁 생성 )
    useEffect(() => {

        if (countDown === "Game start") {
            setShowTarget(true);    // 과녁 등장

            let randomW = Math.floor(Math.random() * 60) + 6;       // 6 ~ 65
            let randomH = Math.floor(Math.random() * 58) + 13;      // 13 ~ 70

            // 과녁 위치 초기화
            setTargetW(randomW);
            setTargetH(randomH);
        }

    }, [countDown]);

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
                            "game": "Orange",
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
                                "game": "Orange",
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

    // 과녁 클릭 성공
    function getScore() {
        if (step === "PLAY" && countDown === "Game start") {
            let randomNumber = Math.floor(Math.random() * 5);   // 0 ~ 4

            setScore(score + 1);                                // 점수 + 1
            if (isPlaySound) playScoreSounds[randomNumber]();   // 발사음

            let randomW = Math.floor(Math.random() * 60) + 5;       // 6 ~ 65
            let randomH = Math.floor(Math.random() * 58) + 13;      // 13 ~ 70

            // 과녁 위치 초기화
            setTargetW(randomW);
            setTargetH(randomH);
        }
    }

    // 과녁 클릭 실패
    function downScore() {
        if (step === "PLAY" && countDown === "Game start") {
            setScore(score - 1);                // 점수 - 1
            if (isPlaySound) playWrongSound();    // 효과음
        }

    }

    // 게임 시작 버튼
    function play() {
        setStep("PLAY");
        setCurrentMusic(orangeBackgroundMusic);
        setCurrentMusicVolume(0.4);
    }

    // 재시도 버튼
    function retry() {
        setStep("READY");
        setCurrentMusic(homeBackgroundMusic);
        setCurrentMusicVolume(1);

        setCountDown(3);
        setStopwatch(30);
        setScore(0);

        setShowTarget(false);
    }

    if (step === "READY") {
        content = <div id={gameStyle["container"]}>
            <HowToPlay
                title="Orange"
                iconSource={orangeIcon}
                iconSize={"13vh"}
                description={
                    <div>
                        마우스 왼쪽 클릭으로 화면에 무작위로 나타나는 <b className={colorStyle["orange-font"]}>과녁</b>을 클릭하세요.<br />
                        과녁이 아닌 다른 곳을 클릭하면 점수가 차감됩니다.<br />
                    </div>
                }
                stopwatch="30초"
            />
            <div id={gameStyle["start-button"]} className={colorStyle["orange-background"]} onClick={play} >
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
            <div id={style["game-container"]} onMouseDown={downScore}>
                <img
                    src={orangeIcon}
                    alt="target"
                    style={{
                        left: `${targetW}vw`,
                        top: `${targetH}vh`,
                        display: `${showTarget ? 'inline-block' : 'none'}`
                    }}
                    id={style["target"]}
                    onMouseDown={(event) => {
                        event.stopPropagation();
                        getScore();
                    }}
                />
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
                game="Orange"
                fontColor="orange-font"
                score={score}
                countAll={countAll}
                rank={rank}
                percentile={percentile}
            />
            <div id={gameStyle["start-button"]} className={colorStyle["orange-background"]} onClick={retry} >
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

export default OrangeGamePage;