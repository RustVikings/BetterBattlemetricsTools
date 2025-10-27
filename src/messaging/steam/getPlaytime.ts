import { createMessage } from "@vocably/hermes";
import { Player } from "@src/types";

type getSteamPlaytimeArgs = { steamApiKey: string; steamID: string };
type getSteamPlaytimeResponse = {
    Player: {
        player: Player;
    };
};

export const [getSteamPlaytime, onGetSteamPlaytime] = createMessage<
    getSteamPlaytimeArgs,
    getSteamPlaytimeResponse
>("getSteamPlaytime");
