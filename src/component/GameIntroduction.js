import React from 'react';
import { Link } from 'react-router-dom';
import style from '../style/HomeStyle.module.css';

function GameIntroduction({ color, title, link }) {

    let description = null;     // 게임 설명

    if(title === "Red")
    {
        description = <p className={style["game-description"]}>
            내용<br />
            내용<br />
            내용
        </p>
    }
    else if(title === "Orange")
    {
        description = <p className={style["game-description"]}>
            내용<br />
            내용<br />
            내용<br />
        </p>
    }
    else if(title === "Yellow")
    {
        description = <p className={style["game-description"]}>
            내용<br />
            내용<br />
            내용
        </p>
    }
    else if(title === "Green")
    {
        description = <p className={style["game-description"]}>
            내용<br />
            내용<br />
            내용
        </p>
    }
    else if(title === "Skyblue")
    {
        description = <p className={style["game-description"]}>
            내용<br />
            내용<br />
            내용
        </p>
    }
    else if(title === "Blue")
    {
        description = <p className={style["game-description"]}>
            내용<br />
            내용<br />
            내용
        </p>
    }
    else if(title === "Purple")
    {
        description = <p className={style["game-description"]}>
            내용<br />
            내용<br />
            내용
        </p>
    }
    else if(title === "Pink")
    {
        description = <p className={style["game-description"]}>
            내용<br />
            내용<br />
            내용
        </p>
    }
    else if(title === "Black")
    {
        description = <p className={style["game-description"]}>
            내용<br />
            내용<br />
            내용
        </p>
    }

    return (
        <div className={style["game-introduction"]}>
            <span style={{ "display": "flex", "text-align": "center" }}>
                <div style={{ "background-color": color }} className={style["game-color"]}>
                </div>
                <span className={style["game-description-block"]}>
                    <div className={style["game-title"]}>{ title }</div>
                    {description}
                </span>
            </span>
            <span>
                <Link to={ link } className={style["game-play-button"]}>
                    PLAY
                </Link>
            </span>
        </div>
    );
}

export default GameIntroduction;