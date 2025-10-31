import { Player } from "@src/types";
import { createMessage } from "@vocably/hermes";

type getPlayerSummariesArgs = { steamApiKey: string; steamID: string };
type getPlayerSummariesResponse = {
    Player: {
        player: Player;
    };
};

/**
 * Setup message and listener handler for getting player summaries from Steam API
 *
 * @param steamApiKey - The API key for Steam
 * @param steamID - The Steam ID of the player to retrieve summaries for
 *
 * @returns A promise that resolves to the player summaries data
 */
export const [getPlayerSummaries, onGetPlayerSummaries] = createMessage<
    getPlayerSummariesArgs,
    getPlayerSummariesResponse
>("getPlayerSummaries");
