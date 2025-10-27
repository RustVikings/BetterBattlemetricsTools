import { Player } from "@src/types";
import { createMessage } from "@vocably/hermes";

type getPlayerSummariesArgs = { steamApiKey: string; steamID: string };
type getPlayerSummariesResponse = {
    Player: {
        player: Player;
    };
};

export const [getPlayerSummaries, onGetPlayerSummaries] = createMessage<
    getPlayerSummariesArgs,
    getPlayerSummariesResponse
>("getPlayerSummaries");
