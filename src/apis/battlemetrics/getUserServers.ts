export async function getMyServers(battlemetricsApiKey: string): Promise<any> {
    await fetch(
        `https://api.battlemetrics.com/servers?filter[rcon]=true&page[size]=100&access_token=${battlemetricsApiKey}`,
    ).then((apiResponse) =>
        apiResponse
            .json()
            .then((toJson) => ({
                servers: toJson.data,
            }))
            .then((res) => {
                return { ...res.servers };
            }),
    );
}
