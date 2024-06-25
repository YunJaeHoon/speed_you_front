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
                <div id={style["title"]}>
                    Speed.you
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
                <GameIntroduction color="#FF1F00" title="Red" link="/game/red" />
                <Divider />
                <GameIntroduction color="#FF7900" title="Orange" link="/game/orange" />
                <Divider />
                <GameIntroduction color="#FFC700" title="Yellow" link="/game/yellow" />
                <Divider />
                <GameIntroduction color="#20CC20" title="Green" link="/game/green" />
                <Divider />
                <GameIntroduction color="#43C9FF" title="Skyblue" link="/game/skyblue" />
                <Divider />
                <GameIntroduction color="#0075FF" title="Blue" link="/game/blue" />
                <Divider />
                <GameIntroduction color="#C465FF" title="Purple" link="/game/purple" />
                <Divider />
                <GameIntroduction color="#FF7596" title="Pink" link="/game/pink" />
                <Divider />
                <GameIntroduction color="#20201E" title="Black" link="/game/black" />
                <div style={{ "height": "300px" }}></div>
            </div>
        </div>
    );
}

export default HomePage;