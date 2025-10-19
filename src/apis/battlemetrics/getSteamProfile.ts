export async function getSteamProfile(
    playerId: string,
    battlemetricsApiKey: string,
): Promise<string> {
    const response = await fetch(
        `https://api.battlemetrics.com/players/${playerId}/relationships/steam-profile?version=%5E0.1.0&access_token=${battlemetricsApiKey}`,
    );
    const profile = await response.json();
    return profile.data;
}
