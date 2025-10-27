import { DataPoint } from "../datapoint";
import { LoadingState, Player, Options } from "@src/types";
import { PlayerContext, LoadingContext, OptionsContext } from "../../component";
import { Playtime } from "../playtime/component";
import classNames from "classnames";
import css from "../../styles.module.css";
import moment from "moment";
import React, { JSX, useContext } from "react";

export function PlayerInfo(): JSX.Element {
    const Player = useContext(PlayerContext) as Player;
    const Loading = useContext(LoadingContext) as LoadingState;
    const Options = useContext(OptionsContext) as Options;
    const steamProfile = Player.profile.steam;
    const battlemetricsProfile = Player.profile.battlemetrics;
    const reports = Player.stats.reports;
    const anticheat = Player.stats.anticheat;

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
        <div className={classNames(css.section, css.cols_6)}>
            <div>
                {/* Steam and Battlemetrics profiles age and status */}
                <DataPoint
                    label="Steam profile visibility"
                    value={
                        Loading.steamProfile
                            ? "Loading..."
                            : steamProfile?.communityvisibilitystate === 3
                            ? "Public"
                            : "Private"
                    }
                    className={css.data_point}
                    severity={
                        steamProfile?.communityvisibilitystate === 3
                            ? "normal"
                            : "danger"
                    }
                />
                <DataPoint
                    label="Steam account age"
                    value={
                        Loading.steamProfile
                            ? "Loading..."
                            : moment
                                  .unix(steamProfile?.timecreated)
                                  .format("MMM DD, YYYY") +
                              " (" +
                              moment
                                  .unix(steamProfile?.timecreated)
                                  .fromNow(true) +
                              ")"
                    }
                    title={`Account created: ${moment(
                        battlemetricsProfile?.createdAt as Date,
                    ).format("LLLL")}`}
                />
                <DataPoint
                    label="Battlemetrics profile age"
                    value={
                        Loading.playerInfo
                            ? "Loading..."
                            : moment(battlemetricsProfile?.createdAt).format(
                                  "MMM DD, YYYY",
                              ) +
                              " (" +
                              moment(battlemetricsProfile?.createdAt).fromNow(
                                  true,
                              ) +
                              ")"
                    }
                    title={`Joined: ${moment(
                        battlemetricsProfile.createdAt as Date,
                    ).format("LLLL")}`}
                />
            </div>
            <div>
                {/* reports */}
                <DataPoint
                    label="Cheating Reports"
                    value={
                        Loading.playerActivity
                            ? "Loading..."
                            : `${reports.cheat} (${reports.cheat_24h} last 24h)`
                    }
                    severity={
                        Loading.playerActivity
                            ? "Loading..."
                            : reportsSeverity(reports.cheat)
                    }
                />
                <DataPoint
                    label="Teaming Reports"
                    value={
                        Loading.playerActivity
                            ? "Loading..."
                            : `${reports.teaming} (${reports.teaming_24h} last 24h)`
                    }
                    severity={
                        Loading.playerActivity
                            ? "Loading..."
                            : reportsSeverity(reports.teaming)
                    }
                />
                <DataPoint
                    label="Other Reports"
                    value={
                        Loading.playerActivity
                            ? "Loading..."
                            : `${reports.other} (${reports.other_24h} last 24h)`
                    }
                    severity={
                        Loading.playerActivity
                            ? "Loading..."
                            : reportsSeverity(reports.other)
                    }
                />
            </div>
            {Options.arkan ? (
                <div>
                    <DataPoint
                        label="Arkan [no-recoil] warnings"
                        value={
                            Loading.playerActivity
                                ? "Loading..."
                                : `${anticheat.arkan.no_recoil} (${anticheat.arkan.no_recoil_24h} last 24h)`
                        }
                        severity={
                            Loading.playerActivity
                                ? "Loading..."
                                : reportsSeverity(anticheat.arkan.no_recoil)
                        }
                    />
                    <DataPoint
                        label="Arkan [aimbot] warnings"
                        value={
                            Loading.playerActivity
                                ? "Loading..."
                                : `${anticheat.arkan.aimbot} (${anticheat.arkan.aimbot_24h} last 24h)`
                        }
                        severity={
                            Loading.playerActivity
                                ? "Loading..."
                                : reportsSeverity(anticheat.arkan.aimbot)
                        }
                    />
                </div>
            ) : null}
            {Options.guardian ? (
                <div>
                    <DataPoint
                        label="Guardian [cheating] warnings"
                        value={
                            Loading.playerActivity
                                ? "Loading..."
                                : `${anticheat.guardian.cheat} (${anticheat.guardian.cheat_24h} last 24h)`
                        }
                        severity={
                            Loading.playerActivity
                                ? "Loading..."
                                : reportsSeverity(anticheat.guardian.cheat)
                        }
                    />
                    <DataPoint
                        label="Guardian [anti-flood] warnings"
                        value={
                            Loading.playerActivity
                                ? "Loading..."
                                : `${anticheat.guardian.antiflood} (${anticheat.guardian.antiflood_24h} last 24h)`
                        }
                        severity={
                            Loading.playerActivity
                                ? "Loading..."
                                : reportsSeverity(anticheat.guardian.antiflood)
                        }
                    />
                </div>
            ) : null}
            <div className="col-span-2">
                <Playtime />
            </div>
        </div>
    );
}
