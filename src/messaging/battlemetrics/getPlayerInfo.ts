import { createMessage } from "@vocably/hermes";
import { OwnServer, Player } from "@src/types";

type getPlayerInfoArgs = {
    battlemetricsApiToken: string;
    playerId: string;
    ownServers: OwnServer[];
};

type getPlayerInfoResponse = {
    Player: {
        player: Player;
    };
};

/** * Setup message and listener handler for getting player info from Battlemetrics API
 *
 * @param battlemetricsApiToken - The API token for Battlemetrics
 * @param playerId - The ID of the player to retrieve info for
 * @param ownServers - The list of own servers to check player's current server against from options
 *
 * @returns A promise that resolves to the player info data
 */
export const [getPlayerInfo, onGetPlayerInfo] = createMessage<
    getPlayerInfoArgs,
    getPlayerInfoResponse
>("getPlayerInfo");
