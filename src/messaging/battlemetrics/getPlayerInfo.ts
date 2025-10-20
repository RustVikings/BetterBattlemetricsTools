import { createMessage } from "@vocably/hermes";
import { BattlemetricsPlayerProfile } from "../../components/panel/component";
import { PlayerActivity } from "../../components/panel/component";

type getPlayerInfoArgs = { battlemetricsApiToken: string; playerId: string };

type getPlayerInfoResponse = {
    player: BattlemetricsPlayerProfile | undefined;
    activity: PlayerActivity | undefined;
};

export const [getPlayerInfo, onGetPlayerInfo] = createMessage<
    getPlayerInfoArgs,
    getPlayerInfoResponse
>("getPlayerInfo");
