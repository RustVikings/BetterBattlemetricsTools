import { createMessage } from "@vocably/hermes";

type battlemetrics = { key: string };
type getServersResponse = { serverList: Record<string, unknown> };

export const [getServers, onGetServers] = createMessage<
    battlemetrics,
    getServersResponse
>("getServers");
