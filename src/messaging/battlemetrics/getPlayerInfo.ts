import { createMessage } from "@vocably/hermes";

type getPlayerInfoArgs = { battlemetricsApiToken: string; playerId: string };
type getPlayerInfoResponse = { player: string | null };

export const [getPlayerInfo, onGetPlayerInfo] = createMessage<
    getPlayerInfoArgs,
    getPlayerInfoResponse
>("getPlayerInfo");
