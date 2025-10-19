export async function getPlayerSummaries(
    steamApiKey: string,
    steamID: string,
): Promise<unknown> {
    const response = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamID}`,
    );
    const steamPlayer = await response.json();
    console.log("getPlayerSummaries: steamPlayer", steamPlayer);
    return steamPlayer;
}
