import {
    BattlemetricsPlayerProfile,
    BattlemetricsPlayerStats,
    BattlemetricsCurrentServer,
    BattlemetricsPlayerIPs,
} from "./battlemetrics";
import { SteamPlayerProfile } from "./steam";

/**
 * Combined player profile information from Battlemetrics and Steam APIs
 */
export type PlayerProfile = {
    battlemetrics: BattlemetricsPlayerProfile;
    steam: SteamPlayerProfile;
};

/**
 * Combined player information from Battlemetrics and Steam APIs
 */
export type Player = {
    id: string;
    steamID: string;
    profile: PlayerProfile;
    stats: BattlemetricsPlayerStats;
    current_server: BattlemetricsCurrentServer;
    ips: BattlemetricsPlayerIPs[];
};

/**
 * Loading states for various data fetches
 */
export interface LoadingState {
    options: boolean;
    playerInfo: boolean;
    playerActivity: boolean;
    refreshingPlayerActivity: boolean;
    playerActivityInit: boolean;
    steamProfile: boolean;
    steamPlaytime: boolean;
    steamKillsDeaths?: boolean;
}

/**
 * Types for Auto Refresh state and setter
 */
export type AutoreRefreshType = {
    autoRefresh: boolean;
    setAutoRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Export all types from this module
 */
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
    BattlemetricsPlayerIPs,
} from "./battlemetrics";
export { SteamAppId } from "./steam";
export { OwnServerType, OwnServer, Options } from "./options";
export { SteamPlayerProfile } from "./steam";
