import { createMessage } from "@vocably/hermes";
import { Options } from "@src/types";

type getOptionsArgs = null;
type getOptionsResponse = { Options: Options };

export const [getOptions, onGetOptions] = createMessage<
    getOptionsArgs,
    getOptionsResponse
>("getOptions");
