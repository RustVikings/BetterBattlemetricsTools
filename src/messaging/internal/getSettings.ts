import { createMessage } from "@vocably/hermes";

type getSettingsArgs = null;
type getSettingsResponse = { Options: Record<string, unknown> };

export const [getSettings, onGetSettings] = createMessage<
    getSettingsArgs,
    getSettingsResponse
>("getSettings");
