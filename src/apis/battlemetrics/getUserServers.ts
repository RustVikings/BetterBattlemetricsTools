import { OwnServer } from "@src/types";

/**
 * Get a list of servers the user has access to
 *
 * @param battlemetricsApiKey - The API key for Battlemetrics
 * @returns A promise that resolves to the user's servers
 */
export async function getUserServers(
    battlemetricsApiKey: string,
): Promise<unknown> {
    const apiResponse = await fetch(
        `https://api.battlemetrics.com/servers?filter[rcon]=true&page[size]=100&access_token=${battlemetricsApiKey}`,
    );
    const toJson = await apiResponse.json();

    const servers: OwnServer[] = [];
    for (const server of toJson.data) {
        servers.push({
            server: {
                id: server.id,
                name: server.attributes.name,
                ip: server.attributes.ip,
                port: server.attributes.port,
            },
        });
    }

    return {
        servers,
    };
}
