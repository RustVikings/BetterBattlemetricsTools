import { Player, PlayerProfile } from "@src/types";
import { SteamPlayerProfile } from "@src/types/steam";

/**
 * Get Steam player summaries from Steam API
 *
 * @param steamApiKey - The API key for Steam
 * @param steamID - The Steam ID of the player to retrieve summaries for
 *
 * @returns A promise that resolves to the player summaries data
 */
export async function getSteamPlayerSummaries(
    steamApiKey: string,
    steamID: string,
): Promise<unknown> {
    const response = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamID}`,
    );
    const steamPlayer = await response.json();

    const Player: Player = {} as Player;
    Player.profile = {
        steam: {
            avatar: "",
            avatarfull: "",
            avatarhash: "",
            avatarmedium: "",
            communityvisibilitystate: 1,
            lastlogoff: 0,
            personaname: "",
            personastate: 0,
            profilestate: undefined,
            profileurl: "",
            steamid: "",
            timecreated: 0,
        },
    } as PlayerProfile;

    Player.profile.steam = {
        ...steamPlayer.response.players[0],
    } as SteamPlayerProfile;

    return {
        player: Player,
    };
}
