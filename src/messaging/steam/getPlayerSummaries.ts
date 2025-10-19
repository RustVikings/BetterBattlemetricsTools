import { createMessage } from "@vocably/hermes";

type getPlayerSummariesArgs = { steamApiKey: string; steamID: string };
type getPlayerSummariesResponse = { player: unknown | null };

export const [getPlayerSummaries, onGetPlayerSummaries] = createMessage<
    getPlayerSummariesArgs,
    getPlayerSummariesResponse
>("getPlayerSummaries");
