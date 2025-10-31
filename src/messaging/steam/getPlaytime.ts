import { createMessage } from "@vocably/hermes";
import { Player } from "@src/types";

type getSteamPlaytimeArgs = { steamApiKey: string; steamID: string };
type getSteamPlaytimeResponse = {
    Player: {
        player: Player;
    };
};

/**
 * Setup message and listener handler for getting player playtime from Steam API
 *
 * @param steamApiKey - The API key for Steam
 * @param steamID - The Steam ID of the player to retrieve playtime for
 *
 * @returns A promise that resolves to the player playtime data
 */
export const [getSteamPlaytime, onGetSteamPlaytime] = createMessage<
    getSteamPlaytimeArgs,
    getSteamPlaytimeResponse
>("getSteamPlaytime");
