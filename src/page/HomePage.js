import React, { useState, useEffect, useContext } from 'react';

import GameIntroduction from '../component/GameIntroduction';
import Divider from '../component/Divider';
import SoundContext from "../context/SoundContext.js";
import ThemeContext from "../context/ThemeContext.js";

import style from './HomeStyle.module.css';
import colorStyle from '../style/Color.module.css';

import lightScrollIcon from '../image/scroll-icon-light.svg';
import lightCircleIcon from '../image/circle-icon-light.svg';
import darkScrollIcon from '../image/scroll-icon-dark.svg';
import darkCircleIcon from '../image/circle-icon-dark.svg';
import redIcon from '../image/red-icon.svg';
import orangeIcon from '../image/orange-icon.svg';
import yellowIcon from '../image/yellow-icon.svg';
import greenIcon from '../image/green-icon.svg';
import skyblueIcon from '../image/skyblue-icon.svg';
import blueIcon from '../image/blue-icon.svg';
import purpleIcon from '../image/purple-icon.svg';
import homeBackgroundMusic from '../sound/home_background_music.mp3';

function HomePage() {

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [position, setPosition] = useState(0);    // 스크롤 위치

    // 페이지 마운트 시, 실행
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
                <div id={style["title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>Speed.you</div>
                <div id={style["subtitle"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>반응속도 테스트</div>
            </div>
            <div id={style["scroll-container"]} style={{ opacity: 1.6 - position / 250 }}>
                <div className={`${style["scroll-text"]} ${theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}`}>아래로 스크롤</div>
                <img src={theme === "LIGHT" ? lightScrollIcon : darkScrollIcon} alt="scroll-icon" className={style["scroll-icon"]} />
            </div>
            <div id={style["quote"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                "속도는 전쟁의 정수이다."
            </div>
            <div id={style["quote-person"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                손무 (孫武, B.C.544 ~ B.C.496)
            </div>
            <div id={style["circles"]}>
                <img src={theme === "LIGHT" ? lightCircleIcon : darkCircleIcon} className={style["circle-icon"]} alt="circle-icon" />
                <img src={theme === "LIGHT" ? lightCircleIcon : darkCircleIcon} className={style["circle-icon"]} alt="circle-icon" />
                <img src={theme === "LIGHT" ? lightCircleIcon : darkCircleIcon} className={style["circle-icon"]} alt="circle-icon" />
            </div>
            <GameIntroduction iconSource={redIcon} iconSize={"7.5vw"} title="Red" link="/game/red"
                description={
                    <div>
                        붉은색은 열정과 에너지, 그리고 강렬한 감정을 상징합니다.<br />
                        당신이 빠르고, 강하다는 것을 증명하세요.<br />
                        불꽃처럼 뜨겁게 타오르는 순간이 당신을 기다리고 있습니다.
                    </div>
                }
            />
            <Divider />
            <GameIntroduction iconSource={orangeIcon} iconSize={"8vw"} title="Orange" link="/game/orange"
                description={
                    <div>
                        황야 그 어딘가, 주황색 석양은 지고 있으며, 방아쇠는 서늘하게 때를 기다립니다.<br />
                        <i>------ BANG</i>
                    </div>
                }
            />
            <Divider />
            <GameIntroduction iconSource={yellowIcon} iconSize={"7.5vw"} title="Yellow" link="/game/yellow"
                description={
                    <div>
                        어둠이 깊어질수록 빛은 더욱 밝게 타오릅니다.<br />
                        희망은 언제나 그곳에 있습니다.<br />
                        당신은 결국 빛을 찾아낼 것입니다.
                    </div>
                }
            />
            <Divider />
            <GameIntroduction iconSource={greenIcon} iconSize={"8vw"} title="Green" link="/game/green"
                description={
                    <div>
                        생명은 그 자체로 엄청난 가치를 갖고 있습니다.<br />
                        그 속에는 진정성과 역동성이 고스란히 녹아 있어, 우리를 더 높은 곳으로 이끌어 줍니다.<br />
                        당신의 생명력을 보여주세요.
                    </div>
                }
            />
            <Divider />
            <GameIntroduction iconSource={skyblueIcon} iconSize={"7.5vw"} title="Skyblue" link="/game/skyblue"
                description={
                    <div>
                        무한한 시간 속에서, 우리는 영원함을 꿈꾸며 허덕입니다.<br />
                        하늘을 바라보며 끝없는 가능성을 상상하지만, 현실은 차갑게 우리를 마주 보고 있습니다.<br />
                        그럼에도 불구하고, 우리는 꿈에 대한 갈망을 멈추지 않습니다.
                    </div>
                }
            />
            <Divider />
            <GameIntroduction iconSource={blueIcon} iconSize={"8vw"} title="Blue" link="/game/blue"
                description={
                    <div>
                        돛을 올리고 뱃머리를 북쪽으로 돌려라!<br />
                        이제는 내 키잡이가 되어, 우리 배를 인도할 시간이다.<br />
                        출항 준비 완료! 바다로 나가자고!
                    </div>
                }
            />
            <Divider />
            <GameIntroduction iconSource={purpleIcon} iconSize={"8vw"} title="Purple" link="/game/purple"
                description={
                    <div>
                        네온 불빛이 흐릿하게 빛나는 거리에서, 당신은 방향을 정해야 합니다.<br />
                        세계 너머의 초월적인 세상을 좇을 것인가요?<br />
                        혹은 당신과 당신이 사는 세계를 믿을 것인가요?
                    </div>
                }
            />
            <Divider />
            <GameIntroduction title="Pink" link="/game/pink"
                description={
                    <div>
                        내용<br />
                        내용<br />
                        내용
                    </div>
                }
            />
            <Divider />
            <GameIntroduction title="Black" link="/game/black"
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