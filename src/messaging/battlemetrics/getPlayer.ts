import { createMessage } from "@vocably/hermes";

type battlemetrics = { battlemetricsApiToken: string; playerId: string };
type getPlayerResponse = { player: Record<string, unknown> };

export const [getPlayer, oneGetPlayer] = createMessage<
    battlemetrics,
    getPlayerResponse
>("getPlayer");
