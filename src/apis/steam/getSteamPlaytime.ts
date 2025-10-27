import { RUST_APP_ID } from "@src/config/";
import {
    BattlemetricsPlayerStats,
    BattlemetricsPlaytimeStats,
    Player,
} from "@src/types";
import { minutesToHours } from "@src/utils/time";

export async function getSteamPlaytime(
    steamApiKey: string,
    steamID: string,
): Promise<unknown> {
    const apiResponse = await fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${steamID}&format=json`,
    );

    const data = await apiResponse.json();

    const Player: Player = {} as Player;
    Player.stats = {
        playtime: {
            steam: 0,
        } as BattlemetricsPlaytimeStats,
    } as BattlemetricsPlayerStats;

    if (!data.response.games) {
        Player.stats.playtime.steam = 0;
    } else {
        const steamPlaytimeHours = Math.round(
            minutesToHours(
                data.response.games.find(
                    (game: { appid: number; playtime_forever: number }) =>
                        game.appid === RUST_APP_ID,
                ).playtime_forever as number,
            ),
        );
        Player.stats.playtime.steam = steamPlaytimeHours;
    }

    return { player: Player };
}
