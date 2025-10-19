import { createMessage } from "@vocably/hermes";

type getServersArgs = { battlemetricsApiToken: string };
type getServersResponse = { servers: Record<string, unknown> };

export const [getServers, onGetServers] = createMessage<
    getServersArgs,
    getServersResponse
>("getServers");
