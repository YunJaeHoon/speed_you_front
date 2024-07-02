import React, { useState, useEffect, useContext, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import useSound from 'use-sound';
import { sendApi, refreshAccessToken } from '../../util/apiUtil.js';

import HowToPlay from '../../component/HowToPlay';
import Result from '../../component/Result';
import SoundContext from "../../context/SoundContext.js";

import style from '../../style/page_style/game/GreenStyle.module.css';
import colorStyle from '../../style/Color.module.css';
import animationStyle from '../../App.module.css';

import greenIcon from '../../image/green-icon.svg';
import score_sound from '../../sound/red_score_sound.mp3';
import countDown_sound from '../../sound/countDown_sound.mp3';
import gameStart_sound from '../../sound/gameStart_sound.mp3';
import gameOver_sound from '../../sound/gameOver_sound.mp3';
import homeBackgroundMusic from '../../sound/home_background_music.mp3';
import greenBackgroundMusic from '../../sound/green_background_music.mp3';
import WaitServer from '../../component/WaitServer.js';

function GreenGamePage() {

    let content = null;

    // context
    const { isPlaySound, currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);

    // state
    const [step, setStep] = useState("READY");                  // 게임 절차
    const [countDown, setCountDown] = useState(3);              // 카운트다운
    const [score, setScore] = useState(0);                      // 점수
    const [countAll, setCountAll] = useState(0);                // 전체 결과 개수
    const [rank, setRank] = useState(0);                        // 순위
    const [percentile, setPercentile] = useState(0);            // 상위 퍼센트

    const [round, setRound] = useState(0);                      // 라운드
    const [score_1, setScore_1] = useState(0);                  // 1라운드 점수
    const [score_2, setScore_2] = useState(0);                  // 2라운드 점수
    const [score_3, setScore_3] = useState(0);                  // 3라운드 점수
    const [score_4, setScore_4] = useState(0);                  // 4라운드 점수
    const [score_5, setScore_5] = useState(0);                  // 5라운드 점수

    // 효과음
    const [playScoreSound] = useSound(score_sound, { volume: 0.5 });
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
            if (isPlaySound) playCountDownSound();                    // 카운트다운 효과음
        }
        else if (step === "PLAY" && countDown === 0) {
            setCountDown("Game start");             // 카운트다운 종료
            if (isPlaySound) playGameStartSound();    // 게임 시작 효과음
        }

    }, [step, countDown]);

    // 게임 시작 (  )
    useEffect(() => {

        if (countDown === "Game start") {
            
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
                            "game": "Green",
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
        setStep("READY");
        setCurrentMusic(homeBackgroundMusic);
        setCurrentMusicVolume(1);

        setCountDown(3);
        setScore(0);

        setRound(0);
        setScore_1(0);
        setScore_2(0);
        setScore_3(0);
        setScore_4(0);
        setScore_5(0);
    }

    if (step === "READY") {
        content = <div>
            <HowToPlay
                title="Green"
                iconSource={greenIcon}
                iconSize={80}
                description={
                    <div>
                        화면 한가운데의 원이 <b className={colorStyle["green-font"]}>초록색</b>이 되는 순간 원을 클릭하세요.<br />
                        총 5번의 기회가 주어지며, 점수는 각 도전 결과의 평균 값으로 측정됩니다.<br />
                        초록색이 되기 전, 원을 누르면 처음부터 다시 시작하니 주의하세요.<br />
                    </div>
                }
                stopwatch="-"
            />
            <div id={style["start-button"]} className={colorStyle["green-main"]} onClick={play} >
                Start
            </div>
        </div>
    }
    else if (step === "PLAY") {
        content = <div id={style["container"]}>
            <div id={style["top-container"]}>
                <div className={style["top-subcontainer"]}>
                    <div className={style["information-title"]}>제한 시간</div>
                    <div className={style["information"]}>-</div>
                </div>
                <div id={countDown === "Game start" ? style["game-start"] : style["count-down"]}>{countDown}</div>
                <div className={style["top-subcontainer"]}>
                    <div className={style["information-title"]}>점수</div>
                    <div className={style["information"]}>{score}</div>
                </div>
            </div>
            <div id={style["game-container"]}>
                
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
                game="Green"
                fontColor="green-font"
                score={score}
                countAll={countAll}
                rank={rank}
                percentile={percentile}
            />
            <div id={style["start-button"]} className={colorStyle["green-main"]} onClick={retry} >
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