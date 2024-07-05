import React, { useState, useEffect, useContext } from 'react';

import GameIntroduction from '../component/GameIntroduction';
import Divider from '../component/Divider';
import SoundContext from "../context/SoundContext.js";

import style from '../style/HomeStyle.module.css';
import scrollIcon from '../image/scroll-icon.svg';
import circleIcon from '../image/circle-icon.svg';
import redIcon from '../image/red-icon.svg';
import orangeIcon from '../image/orange-icon.svg';
import yellowIcon from '../image/yellow-icon.svg';
import greenIcon from '../image/green-icon.svg';
import homeBackgroundMusic from '../sound/home_background_music.mp3';

function HomePage() {

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);

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
        <div id={style["container"]}>
            <div id={style["title-container"]}>
                <div id={style["title"]}>Speed.you</div>
                <div id={style["subtitle"]}>반응속도 테스트</div>
            </div>
            <div id={style["scroll-container"]} style={{ opacity: 1.6 - position / 250 }}>
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
            <GameIntroduction iconSource={redIcon} iconSize={"7.5vw"} color="red-main" title="Red" link="/game/red"
                description={
                    <div>
                        붉은색은 열정과 에너지, 그리고 강렬한 감정을 상징합니다.<br />
                        당신이 빠르고, 강하다는 것을 증명하세요.<br />
                        불꽃처럼 뜨겁게 타오르는 순간이 당신을 기다리고 있습니다.
                    </div>
                }
            />
            <Divider />
            <GameIntroduction iconSource={orangeIcon} iconSize={"8vw"} color="orange-main" title="Orange" link="/game/orange"
                description={
                    <div>
                        주황색 하늘, 석양은 지고 있으며, 총구는 서늘하게 때를 기다립니다.<br />
                        <i>------ BANG</i>
                    </div>
                }
            />
            <Divider />
            <GameIntroduction iconSource={yellowIcon} iconSize={"7.5vw"} color="yellow-main" title="Yellow" link="/game/yellow"
                description={
                    <div>
                        어둠이 깊어질수록 빛은 더욱 밝게 타오릅니다.<br />
                        희망은 언제나 그곳에 있습니다.<br />
                        당신은 결국 빛을 찾아낼 것입니다.
                    </div>
                }
            />
            <Divider />
            <GameIntroduction iconSource={greenIcon} iconSize={"8vw"} color="green-main" title="Green" link="/game/green"
                description={
                    <div>
                        생명은 그 자체로 엄청난 가치를 갖고 있습니다.<br />
                        그 속에는 진정성과 역동성이 고스란히 녹아 있어, 우리를 더 높은 곳으로 이끌어 줍니다.<br />
                        당신의 생명력을 보여주세요.
                    </div>
                }
            />
            <Divider />
            <GameIntroduction color="skyblue-main" title="Skyblue" link="/game/skyblue"
                description={
                    <div>
                        내용<br />
                        내용<br />
                        내용
                    </div>
                }
            />
            <Divider />
            <GameIntroduction color="blue-main" title="Blue" link="/game/blue"
                description={
                    <div>
                        내용<br />
                        내용<br />
                        내용
                    </div>
                }
            />
            <Divider />
            <GameIntroduction color="purple-main" title="Purple" link="/game/purple"
                description={
                    <div>
                        내용<br />
                        내용<br />
                        내용
                    </div>
                }
            />
            <Divider />
            <GameIntroduction color="pink-main" title="Pink" link="/game/pink"
                description={
                    <div>
                        내용<br />
                        내용<br />
                        내용
                    </div>
                }
            />
            <Divider />
            <GameIntroduction color="black-main" title="Black" link="/game/black"
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
    );
}

export default HomePage;