import { BattlemetricsPlayerStats, Player } from "@src/types";
import { RUST_APP_ID } from "@src/config/";

/**
 * Get Steam kills and deaths for Rust from Steam API
 *
 * @param steamApiKey - The API key for Steam
 * @param steamID - The Steam ID of the player to retrieve stats for
 *
 * @returns A promise that resolves to the player's kills and deaths data
 */
export async function getUserStatsForGame(
    steamApiKey: string,
    steamID: string,
): Promise<unknown> {
    const API_URL = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${RUST_APP_ID}&key=${steamApiKey}&steamid=${steamID}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            return Promise.reject(
                `Error fetching Steam Kills/Deaths data: ${response.status} ${response.statusText}`,
            );
        } else {
            const toJson = await response.json();

            const stats = toJson.playerstats.stats;

            const Player: Player = {} as Player;
            Player.stats = {
                kd: {
                    kills: 0,
                    deaths: 0,
                },
            } as BattlemetricsPlayerStats;

            if (!stats || stats.length === 0) {
                Player.stats.kd.kills = 0;
                Player.stats.kd.deaths = 0;
            } else {
                /** Extract relevant stats from the game data */
                const getStats = (statName: string) =>
                    stats.find(
                        (stat: { name: string; value: number }) =>
                            stat.name === statName,
                    )?.value || 0;
                Player.stats.kd.kills = getStats("kill_player");
                Player.stats.kd.deaths =
                    getStats("deaths") -
                    getStats("death_suicide") -
                    getStats("death_fall") -
                    getStats("death_selfinflicted") -
                    getStats("death_entity") -
                    getStats("death_wolf") -
                    getStats("death_bear");
            }


            return {
                player: Player,
            };
        }
    } catch (error) {
        console.error("Error fetching Steam Kills/Deaths data:", error);
        throw error;
    }
}
