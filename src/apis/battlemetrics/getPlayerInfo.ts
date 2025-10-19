export async function getPlayerInfo(
    battlemetricsApiToken: string,
    playerId: string,
): Promise<unknown> {
    console.log("getPlayerInfo called:", playerId, battlemetricsApiToken);
    const apiResponse = await fetch(
        `https://api.battlemetrics.com/players/${playerId}?include=server,identifier&fields[server]=name,ip,port&filter[identifiers]=steamID&access_token=${battlemetricsApiToken}`,
    ).then((res) => res);
    const toJson = await apiResponse.json();
    console.log(
        "getPlayerInfo: toJson",
        toJson.included[0].attributes.identifier,
    );
    return {
        steamID: toJson.included[0].attributes.identifier,
    };
}
