import React, { JSX, useContext } from "react";
import { DataPoint } from "../datapoint";
import css from "../../styles.module.css";
import classNames from "classnames";
import { Playtime } from "../playtime";
import moment from "moment";
import { PlayerProps, PlayerStats, PlayerContext } from "../../component";

export function PlayerInfo(): JSX.Element {
    const player = useContext(PlayerContext) as PlayerProps | undefined;
    const profile = player?.playerProfile;
    const battlemetricsProfile = profile?.data?.attributes;

    // console.log("PlayerInfo: id", player?.id);

    const steamIdentifier = profile?.included?.find(
        (item) =>
            item.type === "identifier" && item.attributes?.type === "steamID",
    );
    const steamProfile = steamIdentifier?.attributes?.metadata;

    const stats = player?.playerStats as PlayerStats;

    console.log("PlayerInfo: stats", stats);

    const reportsSeverity = (reportCount: number) => {
        switch (true) {
            case reportCount > 5:
                return "danger";
            case reportCount > 3 && reportCount <= 5:
                return "warning";
            default:
                return "normal";
        }
    };

    return (
        <div className={classNames(css.section, css.cols_4)}>
            <div>
                <DataPoint
                    label="Steam profile visibility"
                    value={
                        steamProfile?.profile.personastate === 3
                            ? "Public"
                            : "Private"
                    }
                    className={css.data_point}
                    severity={
                        steamProfile?.profile.personastate === 3
                            ? "normal"
                            : "danger"
                    }
                />
                <DataPoint
                    label="Steam account age"
                    value={
                        steamProfile?.profile.timecreated
                            ? moment
                                  .unix(steamProfile?.profile.timecreated)
                                  .format("MMM DD, YYYY") +
                              " (" +
                              moment
                                  .unix(steamProfile?.profile.timecreated)
                                  .fromNow(true) +
                              ")"
                            : "Loading..."
                    }
                    title={`Account created: ${moment(
                        battlemetricsProfile?.createdAt as Date,
                    ).format("LLLL")}`}
                />
                <DataPoint
                    label="First seen on Battlemetrics"
                    value={
                        moment(battlemetricsProfile?.createdAt as Date).format(
                            "MMM DD, YYYY",
                        ) +
                        " (" +
                        moment(battlemetricsProfile?.createdAt as Date).fromNow(
                            true,
                        ) +
                        ")"
                    }
                    title={`Joined: ${moment(
                        battlemetricsProfile?.createdAt as Date,
                    ).format("LLLL")}`}
                />
            </div>
            <div>
                <DataPoint
                    label="Cheating Reports"
                    value={`${stats?.reports.cheat || 0} (${
                        stats?.reports.cheat24h || 0
                    } last 24h)`}
                    severity={reportsSeverity(stats?.reports.cheat || 0)}
                />
                <DataPoint
                    label="Teaming Reports"
                    value={`${stats?.reports.teaming || 0} (${
                        stats?.reports.teaming24h || 0
                    } last 24h)`}
                    severity={reportsSeverity(stats?.reports.teaming || 0)}
                />

                <DataPoint
                    label="Other Reports"
                    value={`${stats?.reports.other || 0} (${
                        stats?.reports.other24h || 0
                    } last 24h)`}
                    severity={reportsSeverity(stats?.reports.other || 0)}
                />
            </div>
            <div>
                <DataPoint
                    label="EAC Banned IPs"
                    value="0"
                    className={css.data_point}
                    severity="normal"
                />
                <DataPoint
                    label="Battlemetrics Banned IPs"
                    value="0"
                    severity="normal"
                />
                <DataPoint
                    label="First seen on Battlemetrics"
                    value="5 years ago"
                />
            </div>
            <div className="col-span-3">
                <Playtime />
            </div>
        </div>
    );
}
