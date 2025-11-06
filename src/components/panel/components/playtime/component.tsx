import React, { JSX, use, useContext } from "react";
import classNames from "classnames";
import css from "../../styles.module.css";
import { Tag } from "../tag";
import { DataPoint } from "../datapoint";
import { PlayerContext, LoadingContext } from "../../component";
import { Player, LoadingState } from "@src/types";

export function Playtime(): JSX.Element {
    const Player = useContext(PlayerContext) as Player;
    const playtime = Player.stats.playtime;
    const servers_played = Player.stats.servers_played;
    const Loading = useContext(LoadingContext) as LoadingState;
    const playTimeSeverity = (hours: number) => {
        switch (true) {
            case hours < 200:
                return "danger";
            case hours >= 200 && hours < 500:
                return "warning";
            default:
                return "normal";
        }
    };

    const boostedSeverity = (percentage: number) => {
        switch (true) {
            case percentage === 0:
                return "unknown";
            case percentage > 0 && percentage <= 40:
                return "normal";
            case percentage > 40 && percentage <= 80:
                return "warning";
            default:
                return "danger";
        }
    };

    const boostedPercentage = (
        steam: number,
        battlemetrics: number,
    ): number => {
        if (steam && steam > 0 && battlemetrics && battlemetrics > 0) {
            return Math.floor((steam / battlemetrics) * 100 - 100);
        }
        return 0;
    };

    return (
        <div className={classNames(css.play_time, css.widget)}>
            <div className={css.heading}>
                <div className={css.title}>Playtime (hours)</div>
                <Tag
                    value={
                        Loading.playerActivity
                            ? "Loading..."
                            : boostedPercentage(
                                  playtime.steam,
                                  playtime.battlemetrics,
                              ) > 0
                            ? `Steam/BM: ${boostedPercentage(
                                  playtime.steam,
                                  playtime.battlemetrics,
                              )}% `
                            : "Unknown"
                    }
                    severity={
                        Loading.playerActivity
                            ? "Loading..."
                            : boostedSeverity(
                                  boostedPercentage(
                                      playtime.steam,
                                      playtime.battlemetrics,
                                  ),
                              )
                    }
                />
            </div>
            <div className={css.cols_2}>
                <DataPoint
                    label="On your servers"
                    value={
                        Loading.playerActivity
                            ? "Loading..."
                            : playtime.yourservers
                    }
                    severity={
                        Loading.playerActivity
                            ? "Loading..."
                            : playTimeSeverity(playtime.yourservers)
                    }
                    layout="horizontal"
                />
                <DataPoint
                    label="Servers played"
                    value={
                        Loading.playerActivity ? "Loading..." : servers_played
                    }
                    layout="horizontal"
                    alignment="right"
                />
            </div>
            <div className={css.cols_3}>
                <DataPoint
                    label="Steam"
                    value={
                        Loading.playerActivity
                            ? "Loading..."
                            : playtime.steam === 0
                            ? "Private"
                            : playtime.steam
                    }
                    severity={
                        Loading.playerActivity
                            ? "Loading..."
                            : playTimeSeverity(playtime.steam)
                    }
                    alignment="left"
                />
                <DataPoint
                    label="Battlemetrics"
                    value={
                        Loading.playerActivity
                            ? "Loading..."
                            : playtime.battlemetrics
                    }
                    severity={
                        Loading.playerActivity
                            ? "Loading..."
                            : playTimeSeverity(playtime.battlemetrics || 0)
                    }
                    alignment="center"
                />
                <DataPoint
                    label="Aim training"
                    value={Loading.playerActivity ? "Loading..." : playtime.aim}
                    severity={
                        Loading.playerActivity
                            ? "Loading..."
                            : playTimeSeverity(playtime.aim || 0)
                    }
                    alignment="right"
                />
            </div>
        </div>
    );
}
