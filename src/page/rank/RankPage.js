import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis, Legend } from 'recharts';
import { sendApi } from '../../util/apiUtil.js';

import GameSelectButton from '../../component/GameSelectButton.js';
import WaitServer from '../../component/WaitServer.js';

import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './RankStyle.module.css';
import colorStyle from '../../style/Color.module.css';

import redIcon from '../../image/red-icon.svg';
import orangeIcon from '../../image/orange-icon.svg';
import yellowIcon from '../../image/yellow-icon.svg';
import greenIcon from '../../image/green-icon.svg';
import skyblueIcon from '../../image/skyblue-icon.svg';
import blueIcon from '../../image/blue-icon.svg';
import purpleIcon from '../../image/purple-icon.svg';
import pinkIcon from '../../image/pink-icon.svg';
import blackIcon from '../../image/black-icon.svg';

import homeBackgroundMusic from '../../sound/home_background_music.mp3';

function RankPage() {

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { theme } = useContext(ThemeContext);

    // state
    const [game, setGame] = useState("Red");                    // 게임 종류
    const [data, setData] = useState(null);                     // 랭킹 데이터
    const [finishLoading, setFinishLoading] = useState(false)   // 데이터 응답 여부

    // 페이지 마운트 시, 게임 변경 시, 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        // 랭킹 데이터 요청
        const getData = async () => {
            try {
                let response = await sendApi(
                    '/api/rank',
                    "GET",
                    false,
                    {
                        "game": game
                    }
                );

                setData(response);
            } catch (error) {
                setData(null);
            } finally {
                setFinishLoading(true);
            }
        };

        getData();

    }, [game]);

    return (
        <div id={style["container"]}>
            <div id={style["title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>랭킹</div>
            <div id={style["subtitle-container"]}>
                <div id={style["game-icon-container"]}>
                    <img
                        src={
                            game === "Red" ? redIcon :
                            game === "Orange" ? orangeIcon :
                            game === "Yellow" ? yellowIcon :
                            game === "Green" ? greenIcon :
                            game === "Skyblue" ? skyblueIcon :
                            game === "Blue" ? blueIcon :
                            game === "Purple" ? purpleIcon :
                            game === "Pink" ? pinkIcon :
                            blackIcon
                        }
                        id={style["game-icon"]}
                        alt="game-icon"
                    />
                    <span id={style["game-name"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>{game}</span>
                </div>
                <div id={style["select-container"]}>
                    <GameSelectButton
                        game="Red"
                        currentGame={game}
                        background="red-background"
                        onClick={() => {setGame("Red")}}
                    />
                    <GameSelectButton
                        game="Orange"
                        currentGame={game}
                        background="orange-background"
                        onClick={() => {setGame("Orange")}}
                    />
                    <GameSelectButton
                        game="Yellow"
                        currentGame={game}
                        background="yellow-background"
                        onClick={() => {setGame("Yellow")}}
                    />
                    <GameSelectButton
                        game="Green"
                        currentGame={game}
                        background="green-background"
                        onClick={() => {setGame("Green")}}
                    />
                    <GameSelectButton
                        game="Skyblue"
                        currentGame={game}
                        background="skyblue-background"
                        onClick={() => {setGame("Skyblue")}}
                    />
                    <GameSelectButton
                        game="Blue"
                        currentGame={game}
                        background="blue-background"
                        onClick={() => {setGame("Blue")}}
                    />
                    <GameSelectButton
                        game="Purple"
                        currentGame={game}
                        background="purple-background"
                        onClick={() => {setGame("Purple")}}
                    />
                    <GameSelectButton
                        game="Pink"
                        currentGame={game}
                        background="pink-background"
                        onClick={() => {setGame("Pink")}}
                    />
                    <GameSelectButton
                        game="Black"
                        currentGame={game}
                        background="black-background"
                        onClick={() => {setGame("Black")}}
                    />
                </div>
            </div>
            <div id={style["divider"]} className={theme === "LIGHT" ? colorStyle["black-background"] : colorStyle["white-background"]}></div>
            {
                finishLoading ?
                <div id={style["content-container"]}>
                    <ResponsiveContainer width="45%" height="100%" style={{marginTop: "2.5vh"}}>
                        {
                            data != null ?
                            <LineChart data={data.boundary}>
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke={theme === "LIGHT" ? "#20201E" : "#FFFFFF"}
                                    dot={{
                                        stroke: game === "Red" ? "#FF1F00" :
                                            game === "Orange" ? "#FF7900" :
                                            game === "Yellow" ? "#FFC700" :
                                            game === "Green" ? "#20CC20" :
                                            game === "Skyblue" ? "#43C9FF" :
                                            game === "Blue" ? "#0085FF" :
                                            game === "Purple" ? "#C465FF" :
                                            game === "Pink" ? "#FF7596" :
                                            game === "Black" && theme === "LIGHT" ? "#20201E" : "#FFFFFF",
                                        strokeWidth: 5
                                    }}
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                    animationDuration={500}
                                />
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="description"
                                    tick={{ fill: theme === "LIGHT" ? "#20201E" : "#FFFFFF" }}
                                />
                                <YAxis
                                    tick={{ fill: theme === "LIGHT" ? "#20201E" : "#FFFFFF" }}
                                    label={{
                                        value: '점수',
                                        position: 'insideBottom',
                                        offset: 10,
                                        style: { textAnchor: 'middle', fill: theme === "LIGHT" ? "#20201E" : "#FFFFFF" }
                                    }}
                                />
                                <Tooltip
                                    wrapperStyle={{ textAlign: "center" }}
                                    itemStyle={{ color: "#20201E" }}
                                    formatter={(value) => [value, "점수"]}
                                />
                                <Legend
                                    formatter={() => '상위 퍼센트'}
                                    iconSize={0}
                                />
                            </LineChart> :
                            ""
                        }
                    </ResponsiveContainer>
                    <div id={style["topTen-container"]}>
                        <div id={style["topTen-title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>Top 10</div>
                        <div id={style["topTen-subcontainer"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                            <div id={style["topTen-description-container"]}>
                                <span id={style["topTen-order-description"]}>순위</span>
                                <span id={style["topTen-username-description"]}>닉네임</span>
                                <span id={style["topTen-score-description"]}>점수</span>
                                <span id={style["topTen-createdAt-description"]}>날짜</span>
                            </div>
                            {data.top_ten.map((score, index) =>
                                <div className={style["topTen-score-container"]}>
                                    <span className={style["topTen-order"]}>{index + 1}</span>
                                    <span className={style["topTen-username"]}>{score.username ? score.username : "[ Guest ]"}</span>
                                    <span className={style["topTen-score"]}>{score.score}</span>
                                    <span className={style["topTen-createdAt"]}>{score.created_at.split('T')[0]}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div> :
                <div id={style["content-container"]}>
                    <WaitServer />
                </div>
            }
        </div>
    );
}

export default RankPage;