import React, { ChangeEvent, JSX, ReactEventHandler, useContext } from "react";
import css from "../../styles.module.css";
import classNames from "classnames";
import { PlayerContext, LoadingContext } from "@src/components/panel/";
import { Player, LoadingState } from "@src/types";

export function PlayerBanner(): JSX.Element {
    const Player = useContext(PlayerContext) as Player;
    const Loading = useContext(LoadingContext) as LoadingState;
    const steamProfile = Player.profile.steam;

    const handleOnChangeRefresh = (e: ChangeEvent<HTMLInputElement>) => {
        return true;
    };

    const autoRefresh = true;

    return (
        <div className={classNames(css.player_banner, css.section)}>
            <div className={css.player_id}>
                <div className={css.player_banner_avatar}>
                    {steamProfile?.avatarfull && (
                        <img
                            src={steamProfile.avatarfull}
                            alt={`${steamProfile.personaname}'s avatar`}
                        />
                    )}
                </div>
                <div className={css.player_banner_info}>
                    <div className={css.player_name}>
                        {Loading.steamProfile
                            ? "Loading..."
                            : steamProfile?.personaname || "Unknown Player"}
                    </div>
                    <div className={css.player_steam_profile_url}>
                        <a
                            href={steamProfile?.profileurl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {Loading.steamProfile
                                ? "Loading..."
                                : steamProfile?.profileurl || "Unknown Player"}
                        </a>
                    </div>
                </div>
            </div>
            <div className={css.player_status}>
                <div className={classNames([css.switch])}>
                    <label className={css.switch_label} htmlFor="autoRefresh">
                        Auto-update
                    </label>
                    <label className={css.switch_checkbox}>
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            id="autoRefresh"
                            name="autoRefresh"
                            onChange={handleOnChangeRefresh}
                            checked={autoRefresh}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}
