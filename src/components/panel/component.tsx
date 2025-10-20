import React, {
    JSX,
    useContext,
    createContext,
    useState,
    useEffect,
} from "react";
import { getSettings } from "../../messaging/internal/getSettings";
import { getPlayerInfo } from "../../messaging/battlemetrics/getPlayerInfo";
import { getPlayerSummaries } from "../../messaging/steam/getPlayerSummaries";
import css from "./styles.module.css";
import { OrgServer } from "../options/component";
import { PlayerBanner } from "./components/playerbanner/";
import { CurrentServer } from "./components/currentserver/component";
import { PlayerInfo } from "./components/playerinfo/component";
import { getPlayerStats } from "@src/utils/getStats";

export interface BattlemetricsPlayerProfile {
    data: {
        type: string;
        id: string;
        attributes?: {
            [key: string]: unknown;
        };
        relationships?: {
            [key: string]: unknown;
        };
    };
    included?: {
        attributes: {
            [key: string]: any;
        };
        id: string;
        type: string;
        relationships?: {
            [key: string]: unknown;
        };
        meta?: { [key: string]: unknown };
    }[];
}

export interface PlayerActivity {
    data: {
        attributes: {
            [key: string]: any;
        };
        id: string;
        type: string;
        relationships?: {
            [key: string]: unknown;
        };
    }[];
    included?: {
        attributes: {
            [key: string]: any;
        };
        id: string;
        type: string;
        relationships?: {
            [key: string]: unknown;
        };
    };
}

export interface PlayerStats {
    kills: number;
    deaths: number;
    kills24h: number;
    deaths24h: number;
    reports: {
        cheat: number;
        cheat24h: number;
        teaming: number;
        teaming24h: number;
        other: number;
        other24h: number;
    };
}

export interface PlayerProps {
    id?: string;
    steamID?: string;
    playerProfile?: BattlemetricsPlayerProfile;
    playerStats?: PlayerStats;
}

interface OptionsProps {
    battlemetricsApiToken: string;
    steamApiKey: string;
    orgServers: OrgServer[];
}

export const OptionsContext = createContext<OptionsProps | undefined>(
    undefined,
);
export const PlayerContext = createContext<PlayerProps | undefined>(undefined);

export function Panel(): JSX.Element {
    // Get the player ID from the URL
    const currentPageURL = window.location.href;
    const urlMatches = currentPageURL.matchAll(
        /http[s]*:\/\/www.battlemetrics.com\/rcon\/players\/(\d+)/g,
    );
    const playerId = urlMatches?.next().value?.[1] || undefined;

    // Default state for options
    const defaultOptions: OptionsProps = {
        battlemetricsApiToken: "",
        steamApiKey: "",
        orgServers: [],
    };
    // Default state for player
    const defaultPlayer: PlayerProps = {
        id: playerId,
        steamID: undefined,
        playerProfile: undefined,
        playerStats: undefined,
    };

    // State hooks for options and player data
    const [options, setOptions] = useState<OptionsProps>(defaultOptions);
    const [playerData, setPlayerData] = useState<PlayerProps>(defaultPlayer);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const response = await getSettings(null);
                const options = response.Options;
                if (options) {
                    setOptions({
                        battlemetricsApiToken:
                            typeof options?.battlemetricsApiToken === "string"
                                ? options.battlemetricsApiToken
                                : "",
                        steamApiKey:
                            typeof options?.steamApiKey === "string"
                                ? options.steamApiKey
                                : "",
                        orgServers: Array.isArray(options?.orgServers)
                            ? options.orgServers
                            : [],
                    });
                }
            } catch (e) {
                // fallback to defaultOptions
                setOptions(defaultOptions);
            }
        }
        fetchOptions();
    }, []);

    useEffect(() => {
        async function fetchPlayer() {
            if (options.battlemetricsApiToken && playerData?.id) {
                try {
                    const response = await getPlayerInfo({
                        battlemetricsApiToken: options.battlemetricsApiToken,
                        playerId: playerData.id,
                    });
                    const player = response.player;
                    const activity = response.activity;
                    const stats = getPlayerStats(activity, playerId);
                    console.log("Panel: playerStats", stats);
                    if (player) {
                        // console.log("Panel: playerRecord", player);
                        setPlayerData((prevData) => ({
                            ...prevData,
                            id: playerId,
                            steamID: player.included?.find(
                                (item: any) =>
                                    item.type === "identifier" &&
                                    item.attributes?.type === "steamID",
                            )?.attributes.value,
                            playerProfile: player,
                            playerStats: stats,
                        }));
                    } else {
                        setPlayerData((prevData) => ({
                            ...prevData,
                            steamId: undefined,
                            playerProfile: undefined,
                            playerStats: undefined,
                        }));
                    }
                } catch (e) {
                    // fallback to defaultPlayer
                    setPlayerData((prevData) => ({
                        ...prevData,
                        steamId: undefined,
                    }));
                }
            }
        }
        fetchPlayer();
    }, [options.battlemetricsApiToken, playerData.id]);

    return (
        <OptionsContext.Provider value={options}>
            <PlayerContext.Provider value={playerData}>
                <div className={css.box}>
                    <PlayerBanner />
                    <CurrentServer />
                    <PlayerInfo />
                </div>
            </PlayerContext.Provider>
        </OptionsContext.Provider>
    );
}
