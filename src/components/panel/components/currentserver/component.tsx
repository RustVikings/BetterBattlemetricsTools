import { DataPoint } from "../datapoint";
import { KillDeathRatio } from "../killdeathratio/component";
import { LoadingState, Player } from "@src/types";
import { PlayerContext, LoadingContext } from "@src/components/panel/";
import classNames from "classnames";
import css from "../../styles.module.css";
import moment from "moment";
import React, { JSX, useContext } from "react";

export function CurrentServer(): JSX.Element {
    const Player = useContext(PlayerContext) as Player;
    const Loading = useContext(LoadingContext) as LoadingState;
    const currentServer = Player?.current_server;
    const stats = Player.stats;

    const kdRatio = (kills: number, deaths: number): number => {
        if (deaths === 0) return kills;
        return parseFloat((kills / deaths).toFixed(2));
    };

    return (
        <div className={classNames(css.section, css.cols_2)}>
            <div>
                <DataPoint
                    label="Current Server"
                    value={
                        Loading.playerActivityInit && Loading.playerActivity
                            ? "Loading..."
                            : currentServer?.attributes.name || "Offline"
                    }
                    title={
                        Loading.playerActivityInit && Loading.playerActivity
                            ? "Loading..."
                            : currentServer?.attributes.name || "Offline"
                    }
                />
                <DataPoint
                    label="Server address"
                    value={
                        Loading.playerActivityInit && Loading.playerActivity
                            ? "Loading..."
                            : currentServer?.attributes.ip &&
                              currentServer?.attributes.port
                            ? `${currentServer?.attributes.ip}:${currentServer?.attributes.port}`
                            : "Unavailable"
                    }
                    title={
                        Loading.playerActivityInit && Loading.playerActivity
                            ? "Loading..."
                            : currentServer?.attributes.ip &&
                              currentServer?.attributes.port
                            ? `${currentServer?.attributes.ip}:${currentServer?.attributes.port}`
                            : "Unavailable"
                    }
                />
                <DataPoint
                    label="Join time"
                    // value={(currentServer?.meta?.firstSeen as string) || "N/A"}
                    value={
                        Loading.playerActivity
                            ? "Loading..."
                            : currentServer?.attributes.joined
                            ? `${moment(
                                  currentServer?.attributes.joined as Date,
                              ).fromNow()}`
                            : "Unavailable"
                    }
                    title={
                        Loading.playerActivity
                            ? "Loading..."
                            : currentServer?.attributes.joined
                            ? `${moment(
                                  currentServer?.attributes.joined as Date,
                              ).fromNow()}`
                            : "Unavailable"
                    }
                />
            </div>
            <div className={classNames(css.cols_2)}>
                <KillDeathRatio
                    title="Last 24 hours"
                    kdRatio={
                        Loading.playerActivity
                            ? "Loading..."
                            : kdRatio(
                                  stats?.kd.kills_24h,
                                  stats?.kd.deaths_24h,
                              ).toFixed(2)
                    }
                    period="24h"
                />
                <KillDeathRatio
                    title="All time"
                    kdRatio={
                        Loading.playerActivity
                            ? "Loading..."
                            : kdRatio(
                                  stats?.kd.kills,
                                  stats?.kd.deaths,
                              ).toFixed(2)
                    }
                    period="total"
                />
            </div>
        </div>
    );
}
