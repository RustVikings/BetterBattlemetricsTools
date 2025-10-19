export async function getUserServers(
    battlemetricsApiKey: string,
): Promise<unknown> {
    const apiResponse = await fetch(
        `https://api.battlemetrics.com/servers?filter[rcon]=true&page[size]=100&access_token=${battlemetricsApiKey}`,
    );
    const toJson = await apiResponse.json();
    return {
        servers: toJson.data,
    };
}
