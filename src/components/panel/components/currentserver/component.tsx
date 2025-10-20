import { DataPoint } from "../datapoint";
import { KillDeathRatio } from "../killdeathratio/component";
import { PlayerContext } from "../../component";
import classNames from "classnames";
import css from "../../styles.module.css";
import moment from "moment";
import React, { JSX, useContext } from "react";
import { parse } from "path";

export function CurrentServer(): JSX.Element {
    const player = useContext(PlayerContext);
    // console.log("CurrentServer: ", player);
    const profile = player?.playerProfile?.included;
    const currentServer = profile?.find(
        (item) => item.type === "server" && item.meta?.online === true,
    );
    const stats = player?.playerStats;

    const kdRatio = parseFloat(stats?.kd24h).toFixed(2) || "N/A";
    return (
        <div className={classNames(css.section, css.cols_2)}>
            <div>
                <DataPoint
                    label="Current Server"
                    value={currentServer?.attributes?.name || "Offline"}
                />
                <DataPoint
                    label="Server address"
                    value={
                        currentServer?.attributes.ip &&
                        currentServer?.attributes.port
                            ? `client.connect ${currentServer?.attributes?.ip}:${currentServer?.attributes?.port}`
                            : "Unavailable"
                    }
                    title={
                        currentServer?.attributes.ip &&
                        currentServer?.attributes.port
                            ? `client.connect ${currentServer?.attributes?.ip}:${currentServer?.attributes?.port}`
                            : "Unavailable"
                    }
                />
                <DataPoint
                    label="Join time"
                    // value={(currentServer?.meta?.firstSeen as string) || "N/A"}
                    value={
                        currentServer?.meta?.lastSeen
                            ? `${moment(
                                  currentServer?.meta?.lastSeen as Date,
                              ).fromNow()}`
                            : "Unavailable"
                    }
                    title={
                        currentServer?.meta?.lastSeen
                            ? `Joined: ${moment(
                                  currentServer?.meta?.lastSeen as Date,
                              ).format("DD/MM/YYYY, h:mm A")}`
                            : "Unavailable"
                    }
                />
            </div>
            <div className={classNames(css.cols_2)}>
                <KillDeathRatio
                    title="Last 24 hours"
                    kdRatio={parseFloat(stats?.kd24h).toFixed(2) || "N/A"}
                    period="24h"
                />
                <KillDeathRatio
                    title="Total"
                    kdRatio={parseFloat(stats?.kd).toFixed(2) || "N/A"}
                    period="total"
                />
            </div>
        </div>
    );
}
