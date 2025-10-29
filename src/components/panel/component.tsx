import {
    BattlemetricsAnticheatStats,
    BattlemetricsPlayerProfile,
    BattlemetricsReportStats,
} from "@src/types/battlemetrics";
import {
    BattlemetricsKDStats,
    BattlemetricsPlaytimeStats,
    Options,
} from "@src/types";
import { CurrentServer } from "./components/currentserver/component";
import { getPlayerActivity } from "@src/messaging/battlemetrics/";
import { getPlayerInfo } from "@src/messaging/battlemetrics/";
import { getPlayerSummaries } from "@src/messaging/steam/";
import { getSteamKillsDeaths, getSteamPlaytime } from "@src/messaging/steam/";
import { Player, LoadingState, SteamPlayerProfile } from "@src/types";
import { PlayerBanner } from "./components/playerbanner/";
import { PlayerInfo } from "./components/playerinfo/component";
import Browser from "webextension-polyfill";
import css from "./styles.module.css";
import React, { JSX, createContext, useState, useEffect } from "react";

export const PlayerContext = createContext<Player | null>(null);
export const LoadingContext = createContext<LoadingState | null>(null);
export const OptionsContext = createContext<Options | undefined>(undefined);

export function Panel(): JSX.Element {
    // Get the player ID from the URL
    const currentPageURL = window.location.href;
    const urlMatches = currentPageURL.matchAll(
        /http[s]*:\/\/www.battlemetrics.com\/rcon\/players\/(\d+)/g,
    );
    const playerId = urlMatches?.next().value?.[1] as string;

    // Default state for options
    const defaultOptions: Options = {
        battlemetricsApiToken: "",
        steamApiKey: "",
        ownServers: [],
    };

    // Default state for player
    const defaultPlayer: Player = {
        id: playerId,
        steamID: "",
        profile: {
            battlemetrics: {} as BattlemetricsPlayerProfile,
            steam: {} as SteamPlayerProfile,
        },
        stats: {
            kd: {
                kills_24h: 0,
                deaths_24h: 0,
                deaths: 0,
                kills: 0,
            } as BattlemetricsKDStats,
            playtime: {
                battlemetrics: 0,
                yourservers: 0,
                aim: 0,
            } as BattlemetricsPlaytimeStats,
            reports: {
                cheat: 0,
                teaming: 0,
                other: 0,
                cheat_24h: 0,
                teaming_24h: 0,
                other_24h: 0,
            } as BattlemetricsReportStats,
            anticheat: {
                arkan: {
                    no_recoil: 0,
                    aimbot: 0,
                    no_recoil_24h: 0,
                    aimbot_24h: 0,
                } as BattlemetricsAnticheatStats["arkan"],
                guardian: {
                    cheat: 0,
                    antiflood: 0,
                    cheat_24h: 0,
                    antiflood_24h: 0,
                } as BattlemetricsAnticheatStats["guardian"],
            },
            servers_played: 0,
        },
    };

    const detfaultLoadingState: LoadingState = {
        options: true,
        playerInfo: true,
        playerActivity: true,
        steamProfile: true,
        steamPlaytime: true,
        steamKillsDeaths: true,
    };

    // State hooks for options and player data
    // const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
    const [Options, setOptions] = useState<Options>(defaultOptions);
    const [Player, setPlayer] = useState<Player>(defaultPlayer);
    const [Loading, setLoading] = useState<LoadingState>(detfaultLoadingState);

    async function fetchOptions() {
        setLoading((prevLoading) => ({
            ...prevLoading,
            options: true,
        }));
        const Options = (await Browser.storage.local.get()) as Options;
        if (Options !== null && Options !== undefined) {
            if (
                !Options.battlemetricsApiToken ||
                !Options.steamApiKey ||
                !Options.ownServers
            ) {
                setOptions(defaultOptions);
            } else {
                setOptions(Options);
            }
            setLoading((prevLoading) => ({
                ...prevLoading,
                options: false,
            }));
        }
    }

    async function fetchPlayerInfo() {
        if (Options.battlemetricsApiToken && Player?.id) {
            try {
                setLoading((prevLoading) => ({
                    ...prevLoading,
                    playerInfo: true,
                }));

                const response = await getPlayerInfo({
                    battlemetricsApiToken: Options.battlemetricsApiToken,
                    playerId: Player.id,
                    ownServers: Options.ownServers,
                });

                const player = response.Player.player;

                console.log("Fetched player info:", player);

                if (player) {
                    console.log("Updating player info:", player);
                    setPlayer((prevPlayer) => ({
                        ...prevPlayer,
                        steamID: player.steamID,
                        id: player.id,
                        profile: {
                            ...prevPlayer.profile,
                            battlemetrics: {
                                ...prevPlayer.profile.battlemetrics,
                                ...player.profile.battlemetrics,
                            },
                        },
                        stats: {
                            ...prevPlayer.stats,
                            playtime: {
                                ...prevPlayer.stats.playtime,
                                ...player.stats.playtime,
                            },
                            servers_played: player.stats.servers_played,
                        },
                    }));
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        playerInfo: false,
                    }));
                } else {
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        playerInfo: true,
                    }));
                }
            } catch (e) {
                // fallback to defaultPlayer
                setPlayer(Player);
            }
        }
    }

    async function fetchPlayerActivity() {
        if (
            Player.id &&
            Options.battlemetricsApiToken &&
            Options.arkan &&
            Options.guardian
        ) {
            try {
                setLoading((prevLoading) => ({
                    ...prevLoading,
                    playerActivity: true,
                }));
                const response = await getPlayerActivity({
                    battlemetricsApiToken: Options.battlemetricsApiToken,
                    playerId: Player.id,
                    arkanWarnings: Options.arkan,
                    guardianWarnings: Options.guardian,
                });

                const player = response.Player.player;

                console.log("Fetched player activity:", player);

                if (player) {
                    console.log("Updating player activity:", player);
                    setPlayer((prevPlayer) => ({
                        ...prevPlayer,
                        stats: {
                            ...prevPlayer.stats,
                            ...player.stats,
                        },
                    }));
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        playerActivity: false,
                    }));
                } else {
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        playerActivity: true,
                    }));
                }
            } catch (e) {
                console.error("Panel: fetchPlayerActivity error", e);
            }
        }
    }

    async function fetchSteamPlayerProfile() {
        if (Player.steamID && Options.steamApiKey) {
            try {
                setLoading((prevLoading) => ({
                    ...prevLoading,
                    steamProfile: true,
                }));
                const response = await getPlayerSummaries({
                    steamApiKey: Options.steamApiKey,
                    steamID: Player.steamID,
                });

                const player = response.Player.player;

                console.log("Fetched Steam player profile:", player);

                if (player) {
                    console.log("Updating Steam player profile:", player);
                    setPlayer((prevPlayer) => ({
                        ...prevPlayer,
                        profile: {
                            ...prevPlayer.profile,
                            steam: {
                                ...prevPlayer.profile.steam,
                                ...player.profile.steam,
                            },
                        },
                    }));
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        steamProfile: false,
                    }));
                } else {
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        steamProfile: true,
                    }));
                }
            } catch (e) {
                console.error("Panel: fetchSteamProfile error", e);
            }
        }
    }

    async function fetchSteamPlaytime() {
        if (Player.steamID && Options.steamApiKey) {
            try {
                setLoading((prevLoading) => ({
                    ...prevLoading,
                    steamPlaytime: true,
                }));
                const response = await getSteamPlaytime({
                    steamApiKey: Options.steamApiKey,
                    steamID: Player.steamID,
                });

                const player = response.Player.player;

                console.log("Fetched Steam playtime:", player);

                if (player) {
                    console.log("Updating Steam playtime:", player);
                    setPlayer((prevPlayer) => ({
                        ...prevPlayer,
                        stats: {
                            ...prevPlayer.stats,
                            playtime: {
                                ...prevPlayer.stats.playtime,
                                steam: player.stats.playtime.steam,
                            },
                        },
                    }));
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        steamPlaytime: false,
                    }));
                } else {
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        steamPlaytime: true,
                    }));
                }
            } catch (e) {
                console.error("Panel: fetchSteamPlaytime error", e);
            }
        }
    }

    async function fetchSteamKillsDeaths() {
        if (Player.steamID && Options.steamApiKey) {
            try {
                setLoading((prevLoading) => ({
                    ...prevLoading,
                    steamKillsDeaths: true,
                }));

                const response = await getSteamKillsDeaths({
                    steamApiKey: Options.steamApiKey,
                    steamID: Player.steamID,
                });

                const player = response.Player.player;

                console.log("Fetched Steam Kills/Deaths:", player);

                if (player) {
                    console.log(
                        "Current Kills/Deaths:",
                        Player.stats.kd,
                        "New Steam Kills/Deaths:",
                        player.stats.kd,
                    );
                    if (
                        player.stats.kd.kills > Player.stats.kd.kills ||
                        !Player.stats.kd.kills
                    ) {
                        console.log(
                            "Updating player kills:",
                            player.stats.kd.kills,
                        );
                        setPlayer((prevPlayer) => ({
                            ...prevPlayer,
                            stats: {
                                ...prevPlayer.stats,
                                kd: {
                                    ...prevPlayer.stats.kd,
                                    kills: player.stats.kd.kills,
                                    deaths: player.stats.kd.deaths,
                                },
                            },
                        }));
                    } else {
                        setPlayer((prevPlayer) => ({
                            ...prevPlayer,
                        }));
                    }
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        steamKillsDeaths: false,
                    }));
                }
            } catch (e) {
                console.error("Panel: fetchSteamKillsDeaths error", e);
            }
        }
    }

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        fetchPlayerInfo();
        fetchPlayerActivity();
    }, [Options.battlemetricsApiToken, Options.ownServers, Player.id]);

    useEffect(() => {
        fetchSteamPlayerProfile();
        fetchSteamPlaytime();
        fetchSteamKillsDeaths();
    }, [Player.steamID, Options.steamApiKey, Loading.playerActivity]);

    // console.log("Rendering Panel component with Player:", Player);

    return (
        <PlayerContext.Provider value={Player}>
            <LoadingContext.Provider value={Loading}>
                <OptionsContext.Provider value={Options}>
                    <div className={css.box}>
                        <PlayerBanner />
                        <CurrentServer />
                        <PlayerInfo />
                    </div>
                </OptionsContext.Provider>
            </LoadingContext.Provider>
        </PlayerContext.Provider>
    );
}
