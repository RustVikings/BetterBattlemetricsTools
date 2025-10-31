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

/**
 * Setup message and listener handler for getting player kills and deaths from Steam API
 *
 * @param steamApiKey - The API key for Steam
 * @param steamID - The Steam ID of the player to retrieve kills and deaths for
 *
 * @returns A promise that resolves to the player kills and deaths data
 */

export const [getSteamKillsDeaths, onGetSteamKillsDeaths] = createMessage<
    getSteamKillsDeathsArgs,
    getSteamKillsDeathsResponse
>("getSteamKillsDeaths");
