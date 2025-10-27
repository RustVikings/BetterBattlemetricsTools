import { createMessage } from "@vocably/hermes";
import { OwnServer } from "@src/types";

type getServersArgs = { battlemetricsApiToken: string };
type getServersResponse = { servers: OwnServer[] };

export const [getServers, onGetServers] = createMessage<
    getServersArgs,
    getServersResponse
>("getServers");
