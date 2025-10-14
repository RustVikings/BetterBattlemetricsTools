import { createMessage } from "@vocably/hermes";

type Options = Record<string, unknown> | undefined;
type getOptionsResponse = { Options: Record<string, unknown> };

export const [getOptions, onGetOptions] = createMessage<
    Options,
    getOptionsResponse
>("getOptions");
