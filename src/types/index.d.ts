import {
    BattlemetricsPlayerProfile,
    BattlemetricsPlayerStats,
    BattlemetricsCurrentServer,
} from "./battlemetrics";
import { SteamPlayerProfile } from "./steam";
import { OwnServer } from "./options";

export type PlayerProfile = {
    battlemetrics: BattlemetricsPlayerProfile;
    steam: SteamPlayerProfile;
};

export type Player = {
    id: string;
    steamID: string;
    profile: PlayerProfile;
    stats: BattlemetricsPlayerStats;
    current_server: BattlemetricsCurrentServer;
};

export type Options = {
    arkan?: boolean;
    battlemetricsApiToken: string;
    battlemetricsApiTokenIsValid?: boolean;
    guardian?: boolean;
    ownServers: OwnServer[];
    refreshingServers?: boolean;
    rustAdmin?: boolean;
    rustStats?: boolean;
    saveButtonText?: string;
    saveEnabled?: boolean;
    serverArmour?: boolean;
    steamApiKey: string;
    steamApiKeyIsValid?: boolean;
};

export interface LoadingState {
    options: boolean;
    playerInfo: boolean;
    playerActivity: boolean;
    steamProfile: boolean;
    steamPlaytime: boolean;
    steamKillsDeaths?: boolean;
}

export {
    BattlemetricsAnticheatStats,
    BattlemetricsArkanMessageTypes,
    BattlemetricsArkanWarning,
    BattlemetricsArkanWarningsTypes,
    BattlemetricsCurrentServer,
    BattlemetricsCurrentServerAttributes,
    BattlemetricsGuardianMessageTypes,
    BattlemetricsGuardianWarning,
    BattlemetricsGuardianWarningsTypes,
    BattlemetricsKDStats,
    BattlemetricsKDStatsTypes,
    BattlemetricsMessageTypes,
    BattlemetricsPlayerProfile,
    BattlemetricsPlayerStats,
    BattlemetricsPlaytimeStats,
    BattlemetricsPlaytimeTypes,
    BattlemetricsReportStats,
    BattlemetricsReportTypes,
} from "./battlemetrics";
export { SteamAppId } from "./steam";

export { OwnServerType, OwnServer } from "./options";

export { SteamPlayerProfile } from "./steam";
