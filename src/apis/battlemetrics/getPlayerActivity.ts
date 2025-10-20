export async function getPlayerActivity(
    battlemetricsApiToken: string,
    playerId: string,
): Promise<unknown> {
    const apiResponse = await fetch(
        `https://api.battlemetrics.com/activity?tagTypeMode=and&filter[types][blacklist]=event:query&filter[players]=${playerId}&include=organization,user&page[size]=1000&access_token=${battlemetricsApiToken}`,
    );
    const toJson = await apiResponse.json();
    return {
        activity: toJson,
    };
}
