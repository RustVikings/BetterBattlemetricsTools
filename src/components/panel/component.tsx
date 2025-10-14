import React, {
    JSX,
    useContext,
    createContext,
    useState,
    useEffect,
    use,
} from "react";
import { getOptions } from "../../messaging/internal/getOptions";
import { getPlayer } from "../../messaging/battlemetrics/getPlayer";
import css from "./styles.module.css";
import { OrgServer, OptionsProps } from "../options/component";

interface Player {
    id?: string;
    steamId?: string;
}

interface BattlemetricsPlayer {
    id?: string;
    attributes?: {
        identifiers?: string[];
    };
}
interface DataProps {
    battlemetricsApiToken: string;
    steamApiKey: string;
    orgServers: OrgServer[];
    player?: Player | null;
}

type DataContextType = {
    data: DataProps;
    setData: React.Dispatch<React.SetStateAction<any>>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function Panel(): JSX.Element;
const currentPageURL = window.location.href;
const urlMatches = currentPageURL.matchAll(
    /http[s]*:\/\/www.battlemetrics.com\/rcon\/players\/(\d+)/g,
);
const playerId = urlMatches?.next().value?.[1] || null;

const defaultOptions: DataProps = {
    battlemetricsApiToken: "",
    steamApiKey: "",
    orgServers: [],
    player: null,
};

const [data, setData] = useState<DataProps>(defaultOptions);
useEffect(() => {
    async function fetchOptions() {
        try {
            const response = await getOptions({});
            const options = response.Options;
            if (options) {
                setData({
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
                    player: playerId ? { id: playerId, steamId: "" } : null,
                });
            }
        } catch (e) {
            // fallback to defaultOptions
            setData(defaultOptions);
        }
    }
    fetchOptions();
}, []);

useEffect(() => {
    async function fetchPlayer() {
        try {
            if (data.battlemetricsApiToken && data.player?.id) {
                const response = await getPlayer({
                    battlemetricsApiToken: data.battlemetricsApiToken,
                    playerId: data.player.id,
                });
                const player: BattlemetricsPlayer = response.player;

                console.log("Panel: fetched player", player);
                // if (player) {
                //     const playerId: string | undefined =
                //         typeof player.id === "string" ? player.id : undefined;
                //     let steamId: string | undefined = undefined;
                //     if (
                //         player.attributes &&
                //         Array.isArray(player.attributes.identifiers)
                //     ) {
                //         const foundSteamId = player.attributes.identifiers.find(
                //             (id: string) =>
                //                 typeof id === "string" &&
                //                 id.startsWith("steam:"),
                //         );
                //         steamId = foundSteamId
                //             ? foundSteamId.replace("steam:", "")
                //             : undefined;
                //     }
                //     setData((prevData: DataProps) => ({
                //         ...prevData,
                //         player: {
                //             id: playerId,
                //             steamId: steamId,
                //         },
                //     }));
                // }
            }
        } catch (e) {
            // fallback to defaultOptions
            setData((prevData: DataProps) => ({
                ...prevData,
                player: null,
            }));
        }
    }
    fetchPlayer();
}, [data.battlemetricsApiToken, data.player?.id]);

console.log("Panel: data", data);
return (
    <DataContext value={{ data, setData }}>
        <div className={css.box}>
            <div className="col-span-2"></div>
            <div className={css.player}>
                <h1>
                    <span className={css.avatar}>
                        <img
                            src="https://avatars.fastly.steamstatic.com/80e716ad96f7a7e6f70ee447687be794299fd8a8_medium.jpg"
                            alt="Player name"
                        />
                        {data.steamApiKey}
                    </span>
                    {"Player name"}
                </h1>
            </div>
        </div>
    </DataContext>
);
