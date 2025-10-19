import React, { JSX } from "react";
import css from "../../styles.module.css";
import classNames from "classnames";

export function PlayerBanner(): JSX.Element {
    return (
        <div className={classNames(css.player_banner, css.section)}>
            <div className={css.player_banner_avatar}>
                <img
                    src="https://avatars.fastly.steamstatic.com/80e716ad96f7a7e6f70ee447687be794299fd8a8_medium.jpg"
                    alt="Boum Boum (Soirée techno)'s avatar"
                />
            </div>
            <div className={css.player_banner_info}>
                <div className={css.player_name}>Boum Boum (Soirée techno)</div>
                <div className={css.player_steam_profile_url}>
                    <a
                        href="https://steamcommunity.com/profiles/76561199803034525"
                        target="_blank"
                        rel="noreferrer"
                    >
                        https://steamcommunity.com/profiles/76561199803034525
                    </a>
                </div>
            </div>
            <div className={css.player_status}></div>
        </div>
    );
}
