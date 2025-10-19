import { createMessage } from "@vocably/hermes";

type getSteamProfileArgs = { steamID: string; steamApiKey: string };
type getSteamProfileResponse = { profile: Record<string, unknown> };

export const [getSteamProfile, onGetSteamProfile] = createMessage<
    getSteamProfileArgs,
    getSteamProfileResponse
>("getSteamProfile");
