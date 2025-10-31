import { createMessage } from "@vocably/hermes";
import { Options } from "@src/types";

type getOptionsArgs = null;
type getOptionsResponse = { Options: Options };

/**
 * Setup message and listener handler for getting user options
 *
 * @returns A promise that resolves to the user options
 */
export const [getOptions, onGetOptions] = createMessage<
    getOptionsArgs,
    getOptionsResponse
>("getOptions");
