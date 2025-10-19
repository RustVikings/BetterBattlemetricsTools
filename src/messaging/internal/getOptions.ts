import { createMessage } from "@vocably/hermes";

type getOptionsArgs = null;
type getOptionsResponse = { Options: Record<string, unknown> };

export const [getOptions, onGetOptions] = createMessage<
    getOptionsArgs,
    getOptionsResponse
>("getOptions");
