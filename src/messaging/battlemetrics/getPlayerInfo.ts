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

export const [getPlayerInfo, onGetPlayerInfo] = createMessage<
    getPlayerInfoArgs,
    getPlayerInfoResponse
>("getPlayerInfo");
