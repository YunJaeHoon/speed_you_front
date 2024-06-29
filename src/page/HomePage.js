import React, { useState, useEffect, useContext } from 'react';

import GameIntroduction from '../component/GameIntroduction';
import Divider from '../component/Divider';
import SoundContext from "../context/SoundContext.js";

import style from '../style/HomeStyle.module.css';
import scrollIcon from '../image/scroll-icon.svg';
import circleIcon from '../image/circle-icon.svg';
import homeBackgroundMusic from '../sound/home_background_music.mp3';

function HomePage() {

    // context
    const { isPlayMusic, currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);

    // state
    const [position, setPosition] = useState(0);    // 스크롤 위치

    // 마운트 시에 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        // 스크롤 위치 최신화 함수
        function onScroll() {
            setPosition(window.scrollY);
        }

        // 스크롤 이벤트마다, 스크롤 위치 최신화
        window.addEventListener("scroll", onScroll);

        // 다른 페이지로 넘어갈 때, 이벤트 리스너 제거
        return () => {
            window.removeEventListener("scroll", onScroll);
        };

    }, []);

    return (
        <div>
            <div id={style["container"]}>
                <div id={style["title-container"]}>
                    <div id={style["title"]}>Speed.you</div>
                    <div id={style["subtitle"]}>반응속도 테스트</div>
                </div>
                <div style={{ opacity: 1.6 - position / 250 }}>
                    <div className={style["scroll-text"]}>아래로 스크롤</div>
                    <img src={scrollIcon} alt="scroll-icon" className={style["scroll-icon"]} />
                </div>
                <div id={style["quote"]}>
                    "속도는 전쟁의 정수이다."
                </div>
                <div id={style["quote-person"]}>
                    손무 (孫武, B.C.544 ~ B.C.496)
                </div>
                <div id={style["circles"]}>
                    <img src={circleIcon} className={style["circle-icon"]} alt="circle-icon" />
                    <img src={circleIcon} className={style["circle-icon"]} alt="circle-icon" />
                    <img src={circleIcon} className={style["circle-icon"]} alt="circle-icon" />
                </div>
                <GameIntroduction color="#FF1F00" title="Red" link="/game/red"
                    description={
                        <div>
                            당신이 앞으로 인생을 살아가면서, 매우 급하게 어디론가 전화를 걸어야 하는 순간이 올 수도 있습니다.<br />
                            그때를 대비하기 위한 연습이라고 생각하세요!
                        </div>
                    }
                />
                <Divider />
                <GameIntroduction color="#FF7900" title="Orange" link="/game/orange"
                    description={
                        <div>
                            석양은 붉게 타오르고, 총구는 서늘하게 때를 기다립니다.<br />
                            <i>------ BANG</i>
                        </div>
                    }
                />
                <Divider />
                <GameIntroduction color="#FFC700" title="Yellow" link="/game/yellow"
                    description={
                        <div>
                            내용<br />
                            내용<br />
                            내용
                        </div>
                    }
                />
                <Divider />
                <GameIntroduction color="#20CC20" title="Green" link="/game/green"
                    description={
                        <div>
                            내용<br />
                            내용<br />
                            내용
                        </div>
                    }
                />
                <Divider />
                <GameIntroduction color="#43C9FF" title="Skyblue" link="/game/skyblue"
                    description={
                        <div>
                            내용<br />
                            내용<br />
                            내용
                        </div>
                    }
                />
                <Divider />
                <GameIntroduction color="#0075FF" title="Blue" link="/game/blue"
                    description={
                        <div>
                            내용<br />
                            내용<br />
                            내용
                        </div>
                    }
                />
                <Divider />
                <GameIntroduction color="#C465FF" title="Purple" link="/game/purple"
                    description={
                        <div>
                            내용<br />
                            내용<br />
                            내용
                        </div>
                    }
                />
                <Divider />
                <GameIntroduction color="#FF7596" title="Pink" link="/game/pink"
                    description={
                        <div>
                            내용<br />
                            내용<br />
                            내용
                        </div>
                    }
                />
                <Divider />
                <GameIntroduction color="#20201E" title="Black" link="/game/black"
                    description={
                        <div>
                            내용<br />
                            내용<br />
                            내용
                        </div>
                    }
                />
                <div style={{ "height": "300px" }}></div>
            </div>
        </div>
    );
}

export default HomePage;