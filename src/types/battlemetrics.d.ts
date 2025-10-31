/**
 * Types for Battlemetrics API interactions
 */

/** Type representing Battlemetrics message types */
export type BattlemetricsMessageTypes =
    | "rustLog:playerDeath:PVP"
    | "rustLog:playerReport"
    | "unknown";
/**
 *
 */
export type BattlemetricsPlaytimeTypes =
    | "steam"
    | "battlemetrics"
    | "yourservers"
    | "aim";
/**
 * Stats for player playtime from different sources
 */
export type BattlemetricsPlaytimeStats = {
    [key in BattlemetricsPlaytimeTypes]: number;
};

/**
 * Types for player report categories
 */
export type BattlemetricsReportTypes =
    | "cheat"
    | "teaming"
    | "other"
    | "cheat_24h"
    | "teaming_24h"
    | "other_24h";

/**
 * Stats for player reports
 */
export type BattlemetricsReportStats = {
    [key in BattlemetricsReportTypes]: number;
};

/**
 * Types for player kill/death stats
 */
export type BattlemetricsKDStatsTypes =
    | "deaths_24h"
    | "deaths"
    | "kd_ratio_24h"
    | "kd_ratio"
    | "kills_24h"
    | "kills";

/**
 * Stats for player kill/death
 */
export type BattlemetricsKDStats = {
    [key in BattlemetricsKDStatsTypes]: number;
};

/**
 * Stats for player anticheat detections
 */
export type BattlemetricsAnticheatStats = {
    arkan: {
        [key in BattlemetricsArkanWarningsTypes]: number;
    };
    guardian: {
        [key in BattlemetricsGuardianWarningsTypes]: number;
    };
};

/**
 * Player stats from Battlemetrics and Steam APIs
 */
export interface BattlemetricsPlayerStats {
    kd: BattlemetricsKDStats;
    playtime: BattlemetricsPlaytimeStats;
    reports: BattlemetricsReportStats;
    anticheat: BattlemetricsAnticheatStats;
    servers_played: number;
}

/** Types for Arkan message categories */
export type BattlemetricsArkanMessageTypes =
    | "[Arkan] No Recoil probable violation"
    | "[Arkan] AIMBOT probable violation";

/** Types for Arkan warning stats */
export type BattlemetricsArkanWarningsTypes =
    | "no_recoil"
    | "aimbot"
    | "no_recoil_24h"
    | "aimbot_24h";

/** Types for Arkan warnings */
export type BattlemetricsArkanWarning = {
    [key in BattlemetricsArkanWarningsTypes]: string;
};

/** Types for Guardian message categories */
export type BattlemetricsGuardianMessageTypes =
    | " for AntiCheat("
    | " for AntiFlood";

/** Types for Guardian warning stats */
export type BattlemetricsGuardianWarningsTypes =
    | "cheat"
    | "antiflood"
    | "cheat_24h"
    | "antiflood_24h";

/** Types for Guardian warnings */
export type BattlemetricsGuardianWarning = {
    [key in BattlemetricsGuardianWarningsTypes]: string;
};

/** Player profile information from Battlemetrics API */
export type BattlemetricsPlayerProfile = {
    id: string;
    name: string;
    private: boolean;
    positiveMatch: boolean;
    createdAt: Date;
    updatedAt: Date;
};

/** Attributes for the current server the player is on */
export type BattlemetricsCurrentServerAttributes = {
    name: string;
    ip: string;
    port: number;
    joined: Date;
};

/** Current server information from Battlemetrics API */
export type BattlemetricsCurrentServer = {
    online: boolean;
    attributes: BattlemetricsCurrentServerAttributes;
};
