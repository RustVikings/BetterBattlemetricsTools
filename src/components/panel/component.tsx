import React, { JSX } from "react";
import css from "./styles.module.css";

export function Panel(): JSX.Element {
    return (
        <div className={css.box}>
            <div className="col-span-2"></div>
            <div className={css.player}>
                <h1>
                    <span className={css.avatar}>
                        <img
                            src="https://avatars.fastly.steamstatic.com/80e716ad96f7a7e6f70ee447687be794299fd8a8_medium.jpg"
                            alt="Player name"
                        />
                    </span>
                    {"Player name"}
                </h1>
            </div>
        </div>
    );
}
