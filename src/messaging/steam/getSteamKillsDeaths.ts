import { createMessage } from "@vocably/hermes";
import { Player } from "@src/types";

type getSteamKillsDeathsArgs = {
    steamApiKey: string;
    steamID: string;
};
type getSteamKillsDeathsResponse = {
    Player: {
        player: Player;
    };
};

export const [getSteamKillsDeaths, onGetSteamKillsDeaths] = createMessage<
    getSteamKillsDeathsArgs,
    getSteamKillsDeathsResponse
>("getSteamKillsDeaths");
