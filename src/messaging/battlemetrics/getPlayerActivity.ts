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

export const [getPlayerActivity, onGetPlayerActivity] = createMessage<
    getPlayerActivityArgs,
    getPlayerActivityResponse
>("getPlayerActivity");
