export async function getPlayerInfo(
    battlemetricsApiToken: string,
    playerId: string,
): Promise<unknown> {
    const apiResponse = await fetch(
        `https://api.battlemetrics.com/players/${playerId}?include=server,identifier&fields[server]=name,ip,port&filter[identifiers]=steamID&access_token=${battlemetricsApiToken}`,
    );
    const toJson = await apiResponse.json();
    return {
        player: toJson,
    };
}
