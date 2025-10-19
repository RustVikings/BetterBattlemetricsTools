import React, {
    JSX,
    useContext,
    createContext,
    useState,
    useEffect,
} from "react";
import { getOptions } from "../../messaging/internal/getOptions";
import { getPlayerInfo } from "../../messaging/battlemetrics/getPlayerInfo";
import { getPlayerSummaries } from "../../messaging/steam/getPlayerSummaries";
import { getSteamProfile } from "../../messaging/battlemetrics/getSteamProfile";
import css from "./styles.module.css";
import { OrgServer } from "../options/component";
import { PlayerBanner } from "./components/playerbanner/";
import { CurrentServer } from "./components/currentserver/component";
import { PlayerInfo } from "./components/playerinfo/component";

interface PlayerProps {
    id?: string;
    steamID?: string;
}

interface SteamProfileProps {
    avatar?: string;
    personaname?: string;
    profileurl?: string;
}

interface OptionsProps {
    battlemetricsApiToken: string;
    steamApiKey: string;
    orgServers: OrgServer[];
}

type DataContextType = {
    options: OptionsProps;
    setOptions: React.Dispatch<React.SetStateAction<OptionsProps>>;
    playerData: PlayerProps;
    setPlayerData: React.Dispatch<React.SetStateAction<PlayerProps>>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function Panel(): JSX.Element {
    const currentPageURL = window.location.href;
    const urlMatches = currentPageURL.matchAll(
        /http[s]*:\/\/www.battlemetrics.com\/rcon\/players\/(\d+)/g,
    );
    const playerId = urlMatches?.next().value?.[1] || undefined;

    const defaultOptions: OptionsProps = {
        battlemetricsApiToken: "",
        steamApiKey: "",
        orgServers: [],
    };

    const defaultPlayer: PlayerProps = {
        id: playerId,
        steamID: undefined,
    };

    const [options, setOptions] = useState<OptionsProps>(defaultOptions);
    const [playerData, setPlayerData] = useState<PlayerProps>(defaultPlayer);

    /*  useEffect(() => {
        async function fetchOptions() {
            try {
                const response = await getOptions(null);
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
    }, []); */

    /* useEffect(() => {
        async function fetchPlayer() {
            if (options.battlemetricsApiToken && playerData?.id) {
                console.log(
                    "Panel: fetching player",
                    playerData.id,
                    options.battlemetricsApiToken,
                );
                try {
                    const response = await getPlayerInfo({
                        battlemetricsApiToken: options.battlemetricsApiToken,
                        playerId: playerData.id,
                    });
                    const player = response.player;
                    console.log("Panel: fetched player", player);
                    if (player) {
                        console.log("Panel: playerRecord", player);
                        setPlayerData((prevData) => ({
                            ...prevData,
                            id: playerId,
                            steamID: player as string,
                        }));
                    } else {
                        setPlayerData((prevData) => ({
                            ...prevData,
                            steamId: undefined,
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
    }, [options.battlemetricsApiToken, playerData.id]); */

    /* useEffect(() => {
        async function fetchSteamPlayer() {
            if (options.steamApiKey && playerData?.steamID) {
                console.log(
                    "Panel: fetching steam player",
                    playerData.steamID,
                    options.steamApiKey,
                );
                try {
                    const response = await getPlayerSummaries({
                        steamApiKey: options.steamApiKey,
                        steamID: playerData.steamID,
                    });
                    const steamPlayer = response.player;
                    console.log("Panel: fetched steam player", steamPlayer);
                    if (steamPlayer) {
                        console.log("Panel: steamPlayerRecord", steamPlayer);
                        // You can update playerData with more Steam info if needed
                    }
                } catch (e) {
                    // Handle error if needed
                }
            }
        }
        fetchSteamPlayer();
    }, [options.steamApiKey, playerData.steamID]); */

    return (
        <DataContext value={{ options, setOptions, playerData, setPlayerData }}>
            <div className={css.box}>
                <PlayerBanner />
                <CurrentServer />
                <PlayerInfo />
            </div>
        </DataContext>
    );
}
