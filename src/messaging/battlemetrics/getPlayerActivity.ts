import { createMessage } from "@vocably/hermes";
import { Player } from "@src/types";

type getPlayerActivityArgs = {
    battlemetricsApiToken: string;
    playerId: string;
    arkanWarnings: boolean;
    guardianWarnings: boolean;
};

type getPlayerActivityResponse = {
    Player: {
        player: Player;
    };
};

/**
 * Setup message and listener handler for getting player activity from Battlemetrics API
 *
 * @param battlemetricsApiToken - The API token for Battlemetrics
 * @param playerId - The ID of the player to retrieve activity for
 * @param arkanWarnings - Whether to include Arkan warnings, as set in options
 * @param guardianWarnings - Whether to include Guardian warnings, as set in options
 *
 * @returns A promise that resolves to the player activity data
 */
export const [getPlayerActivity, onGetPlayerActivity] = createMessage<
    getPlayerActivityArgs,
    getPlayerActivityResponse
>("getPlayerActivity");
