import {
    BattlemetricsAnticheatStats,
    BattlemetricsPlayerProfile,
    BattlemetricsReportStats,
} from "@src/types/battlemetrics";
import {
    AutoreRefreshType,
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
import { REFRESH_PLAYER_ACTIVITY_INTERVAL_MS } from "@src/config/";
import waitForElement from "@src/utils/dom";

export const PlayerContext = createContext<Player | null>(null);
export const LoadingContext = createContext<LoadingState | null>(null);
export const OptionsContext = createContext<Options | undefined>(undefined);

export const AutoRefreshContext = createContext<AutoreRefreshType>({
    autoRefresh: false,
    setAutoRefresh: () => {},
});

let identifiers: NodeListOf<Element>;

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
        current_server: {
            online: false,
            attributes: {
                name: "",
                ip: "",
                port: 0,
                joined: new Date(),
                id: "",
            },
        },
        ips: [],
    };

    // Default state for loading
    const defaultLoadingState: LoadingState = {
        options: true,
        playerInfo: true,
        playerActivity: true,
        playerActivityInit: false,
        refreshingPlayerActivity: false,
        steamProfile: true,
        steamPlaytime: true,
        steamKillsDeaths: true,
    };

    /**
     * Initialize state
     *
     * Options - The user's options
     * Player - The player's data
     * Loading - The loading state of various data fetches
     * autoRefresh - Whether to auto-refresh player activity
     */
    const [Options, setOptions] = useState<Options>(defaultOptions);
    const [Player, setPlayer] = useState<Player>(defaultPlayer);
    const [Loading, setLoading] = useState<LoadingState>(defaultLoadingState);
    const [autoRefresh, setAutoRefresh] = useState<boolean>(false);

    /** Fetch Options
     * Fetch the user's options from storage and update the state.
     * If options are not set, use default options.
     * Updates the Loading state accordingly.
     */
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

    /** Fetch Player Info
     *
     * @param Options.battlemetricsApiToken - The Battlemetrics API token
     * @param Player.id - The player's Battlemetrics ID
     * @param Options.ownServers - The user's own servers
     *
     * Uses the getPlayerInfo messaging function to fetch the player's
     * info from the Battlemetrics API. Updates the Player state with the fetched data.
     */
    async function fetchPlayerInfo() {
        if (Options.battlemetricsApiToken && Player.id) {
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

                if (response.Player) {
                    const player = response.Player.player;
                    setPlayer((prevPlayer) => ({
                        ...prevPlayer,
                        steamID: player.steamID,
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
                        current_server: {
                            online: player.current_server.online,
                            attributes: {
                                ...prevPlayer.current_server.attributes,
                                ...player.current_server.attributes,
                            },
                        },
                        ips: player.ips,
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

    // console.log("Panel: Rendering with Player:", Player);

    /** Fetch Player Activity
     *
     * @param Options.battlemetricsApiToken - The Battlemetrics API token
     * @param Player.id - The player's Battlemetrics ID
     * @param Options.arkan - Whether to fetch Arkan warnings
     * @param Options.guardian - Whether to fetch Guardian warnings
     *
     * Uses the getPlayerActivity messaging function to fetch the player's
     * activity from the Battlemetrics API. Updates the Player state with the fetched data.
     */
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
                    refreshingPlayerActivity: true,
                }));
                const response = await getPlayerActivity({
                    battlemetricsApiToken: Options.battlemetricsApiToken,
                    playerId: Player.id,
                    arkanWarnings: Options.arkan,
                    guardianWarnings: Options.guardian,
                });

                if (response.Player) {
                    const player = response.Player.player;
                    setPlayer((prevPlayer) => ({
                        ...prevPlayer,
                        stats: {
                            ...prevPlayer.stats,
                            kd: {
                                ...prevPlayer.stats.kd,
                                kills_24h: player.stats.kd.kills_24h,
                                deaths_24h: player.stats.kd.deaths_24h,
                            },
                            reports: {
                                ...prevPlayer.stats.reports,
                                ...player.stats.reports,
                            },
                            anticheat: {
                                ...prevPlayer.stats.anticheat,
                                ...player.stats.anticheat,
                            },
                        },
                    }));
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        playerActivity: false,
                    }));
                    if (!Loading.playerActivityInit) {
                        setLoading((prevLoading) => ({
                            ...prevLoading,
                            playerActivityInit: true,
                        }));
                    }
                } else {
                    setLoading((prevLoading) => ({
                        ...prevLoading,
                        playerActivity: true,
                    }));
                }
            } catch (e) {
                console.log("Panel: fetchPlayerActivity error", e);
            }
        }
    }

    /** Fetch Steam Player Profile
     *
     * @param Options.steamApiKey - The Steam API key
     * @param Player.steamID - The player's Steam ID
     *
     * Uses the getPlayerSummaries messaging function to fetch the player's
     * profile from the Steam API. Updates the Player state with the fetched data.
     */
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

                if (response.Player) {
                    const player = response.Player.player;
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
                console.log("Panel: fetchSteamProfile error", e);
            }
        }
    }

    /** Fetch Steam Playtime
     *
     * @param Options.steamApiKey - The Steam API key
     * @param Player.steamID - The player's Steam ID
     *
     * Uses the getSteamPlaytime messaging function to fetch the player's
     * playtime from the Steam API. Updates the Player state with the fetched data.
     */
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

                if (response.Player) {
                    const player = response.Player.player;
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
                console.log("Panel: fetchSteamPlaytime error", e);
            }
        }
    }

    /**
     * Add ISP Information to Identifiers
     *
     * Uses the Player.ips data to add ISP and ASN information to the
     * identifiers displayed on the Battlemetrics player page.
     */
    async function addIspInformationToIdentifiers() {
        waitForElement("td[data-title=Identifier]", () => {
            identifiers = document.querySelectorAll(
                "td[data-title=Identifier] + td[data-title=Type]",
            );
            identifiers.forEach((identifier) => {
                if (identifier.textContent.includes("IP")) {
                    const matchedIP =
                        identifier.previousSibling?.textContent?.match(
                            /(\d{1,3}\.){3}\d{1,3}/,
                        )?.[0];
                    const el = identifier.previousSibling as HTMLElement;
                    const ipEl = el.querySelector(".css-q39y9k");
                    if (matchedIP) {
                        const ip = Player.ips.find((ip) => ip.ip === matchedIP);
                        if (ip) {
                            if (ipEl)
                                ipEl.innerHTML = `${ip.ip}<br/><span class="small">ISP: <a href="https://www.google.com/search?q=${ip.metadata.connectionInfo.isp}" title="Search: ${ip.metadata.connectionInfo.isp} " target="_blank" rel="noopener noreferrer">${ip.metadata.connectionInfo.isp}</a>  | ASN: <a href="https://ipinfo.io/${ip.metadata.connectionInfo.asn}" title="Search: ${ip.metadata.connectionInfo.asn}" target="_blank" rel="noopener noreferrer">${ip.metadata.connectionInfo.asn}</a></span>`;
                        }
                    }
                }
            });
        });
    }

    /**
     * Fetch Steam Kills/Deaths
     *
     * @param Options.steamApiKey - The Steam API key
     * @param Player.steamID - The player's Steam ID
     *
     * Uses the getSteamKillsDeaths messaging function to fetch the player's
     * kills and deaths from the Steam API. Updates the Player state with the
     * fetched data if it is greater than the existing data.
     */
    async function fetchUserStatsForGames() {
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

                if (response.Player) {
                    const player = response.Player.player;
                    if (
                        player.stats.kd.kills > Player.stats.kd.kills ||
                        !Player.stats.kd.kills
                    ) {
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
                console.log("Panel: fetchSteamKillsDeaths error", e);
            }
        }
    }

    /**
     * Use effects to fetch data on component mount and when dependencies change
     */

    /** Fetch options on mount */
    useEffect(() => {
        fetchOptions();
    }, []);

    /** Fetch player info and activity on mount and when dependencies change
     * Options.battlemetricsApiToken, Options.ownServers, Player.id
     */
    useEffect(() => {
        fetchPlayerInfo();
        fetchPlayerActivity();
    }, [Options.battlemetricsApiToken, Options.ownServers, Player.id]);

    /** Fetch Steam stats when dependencies change
     * Player.steamID, Options.steamApiKey, Loading.playerActivityInit
     */
    useEffect(() => {
        addIspInformationToIdentifiers();
        fetchUserStatsForGames();
        fetchSteamPlayerProfile();
        fetchSteamPlaytime();
    }, [Player.steamID, Options.steamApiKey, Loading.playerActivityInit]);

    /** Auto-refresh player activity */
    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchPlayerActivity();
            }, REFRESH_PLAYER_ACTIVITY_INTERVAL_MS);
            return () => clearInterval(interval);
        } else {
            return;
        }
    }, [autoRefresh]);

    return (
        <AutoRefreshContext.Provider value={{ autoRefresh, setAutoRefresh }}>
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
        </AutoRefreshContext.Provider>
    );
}
