// interface Player {
//     player: Record<string, unknown>;
// }

export async function getPlayer(
    battlemetricsApiToken: string,
    playerId: string,
): Promise<any> {
    await fetch(
        `https://api.battlemetrics.com//players/${playerId}access_token=${battlemetricsApiToken}`,
    ).then((apiResponse) =>
        apiResponse
            .json()
            .then((toJson) => ({
                players: toJson.data,
            }))
            .then((res) => {
                console.log("getPlayer: res", res);

                return { ...res.players };
            }),
    );
}
