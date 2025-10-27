export type BattlemetricsMessageTypes =
    | "rustLog:playerDeath:PVP"
    | "rustLog:playerReport"
    | "unknown";

export type BattlemetricsPlaytimeTypes =
    | "steam"
    | "battlemetrics"
    | "yourservers"
    | "aim";

export type BattlemetricsPlaytimeStats = {
    [key in BattlemetricsPlaytimeTypes]: number;
};

export type BattlemetricsReportTypes =
    | "cheat"
    | "teaming"
    | "other"
    | "cheat_24h"
    | "teaming_24h"
    | "other_24h";

export type BattlemetricsReportStats = {
    [key in BattlemetricsReportTypes]: number;
};

export type BattlemetricsKDStatsTypes =
    | "deaths_24h"
    | "deaths"
    | "kd_ratio_24h"
    | "kd_ratio"
    | "kills_24h"
    | "kills";

export type BattlemetricsKDStats = {
    [key in BattlemetricsKDStatsTypes]: number;
};

export type BattlemetricsAnticheatStats = {
    arkan: {
        [key in BattlemetricsArkanWarningsTypes]: number;
    };
    guardian: {
        [key in BattlemetricsGuardianWarningsTypes]: number;
    };
};

export interface BattlemetricsPlayerStats {
    kd: BattlemetricsKDStats;
    playtime: BattlemetricsPlaytimeStats;
    reports: BattlemetricsReportStats;
    anticheat: BattlemetricsAnticheatStats;
    servers_played: number;
}

export type BattlemetricsArkanMessageTypes =
    | "[Arkan] No Recoil probable violation"
    | "[Arkan] AIMBOT probable violation";

export type BattlemetricsArkanWarningsTypes =
    | "no_recoil"
    | "aimbot"
    | "no_recoil_24h"
    | "aimbot_24h";

export type BattlemetricsArkanWarning = {
    [key in BattlemetricsArkanWarningsTypes]: string;
};

export type BattlemetricsGuardianMessageTypes =
    | " for AntiCheat("
    | " for AntiFlood";

export type BattlemetricsGuardianWarningsTypes =
    | "cheat"
    | "antiflood"
    | "cheat_24h"
    | "antiflood_24h";

export type BattlemetricsGuardianWarning = {
    [key in BattlemetricsGuardianWarningsTypes]: string;
};

export type BattlemetricsPlayerProfile = {
    id: string;
    name: string;
    private: boolean;
    positiveMatch: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type BattlemetricsCurrentServerAttributes = {
    name: string;
    ip: string;
    port: number;
    joined: Date;
};

export type BattlemetricsCurrentServer = {
    online: boolean;
    attributes: BattlemetricsCurrentServerAttributes;
};
