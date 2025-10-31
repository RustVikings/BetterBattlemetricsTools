import { createMessage } from "@vocably/hermes";
import { OwnServer } from "@src/types";

type getServersArgs = { battlemetricsApiToken: string };
type getServersResponse = { servers: OwnServer[] };

/**
 * Setup message and listener handler for getting user servers from Battlemetrics API
 *
 * @param battlemetricsApiToken - The API token for Battlemetrics
 *
 * @returns A promise that resolves to the list of user servers
 */
export const [getServers, onGetServers] = createMessage<
    getServersArgs,
    getServersResponse
>("getServers");
