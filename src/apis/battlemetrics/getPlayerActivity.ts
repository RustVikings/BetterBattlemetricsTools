import {
    BattlemetricsArkanWarningsTypes,
    BattlemetricsCurrentServer,
    BattlemetricsGuardianWarningsTypes,
    BattlemetricsMessageTypes,
    BattlemetricsPlayerStats,
    BattlemetricsReportTypes,
    Player,
    PlayerProfile,
} from "@src/types";

import { isWithin24hours } from "@src/utils/time";
import { parse } from "path";

export async function getPlayerActivity(
    battlemetricsApiToken: string,
    playerId: string,
    arkanWarnings: boolean,
    guardianWarnings: boolean,
): Promise<unknown> {
    const apiResponse = await fetch(
        `https://api.battlemetrics.com/activity?tagTypeMode=and&filter[types][blacklist]=event:query&filter[players]=${playerId}&include=organization,user&page[size]=1000&access_token=${battlemetricsApiToken}`,
    );
    const responseData = await apiResponse.json();

    const Player: Player = {} as Player;

    /* Initialize Player object */
    Player.stats = {
        kd: {
            kills_24h: 0,
            deaths_24h: 0,
            kills: 0,
            deaths: 0,
        },
        reports: {
            cheat: 0,
            teaming: 0,
            other: 0,
            cheat_24h: 0,
            teaming_24h: 0,
            other_24h: 0,
        },
        anticheat: {
            arkan: {
                no_recoil: 0,
                aimbot: 0,
                no_recoil_24h: 0,
                aimbot_24h: 0,
            },
            guardian: {
                cheat: 0,
                antiflood: 0,
                cheat_24h: 0,
                antiflood_24h: 0,
            },
        },
    } as BattlemetricsPlayerStats;

    const stats = Player.stats;
    const player_id_num = parseInt(playerId);

    for (const activity of responseData.data) {
        const messageType = activity.attributes
            .messageType as BattlemetricsMessageTypes;
        if (messageType === "rustLog:playerReport") {
            const reportType = activity.attributes.data
                .reportType as BattlemetricsReportTypes;
            activity.attributes.data.reportType = reportType;
            switch (reportType) {
                case "cheat":
                    stats.reports.cheat++;
                    if (isWithin24hours(activity.attributes.timestamp)) {
                        stats.reports.cheat_24h++;
                    }
                    break;
                case "teaming":
                    stats.reports.teaming++;
                    if (isWithin24hours(activity.attributes.timestamp)) {
                        stats.reports.teaming_24h++;
                    }
                    break;
                case "other":
                    stats.reports.other++;
                    if (isWithin24hours(activity.attributes.timestamp)) {
                        stats.reports.other_24h++;
                    }
                    break;
                default:
                    break;
            }
        } else if (messageType === "rustLog:playerDeath:PVP") {
            if (isWithin24hours(activity.attributes.timestamp)) {
                switch (activity.attributes.data.killer_id) {
                    case player_id_num:
                        stats.kd.kills_24h++;
                        break;
                    default:
                        stats.kd.deaths_24h++;
                }
            }
            switch (activity.attributes.data.killer_id) {
                case player_id_num:
                    stats.kd.kills++;
                    break;
                default:
                    stats.kd.deaths++;
            }
        } else if (messageType === "unknown") {
            if (arkanWarnings) {
                const message = activity.attributes
                    .message as BattlemetricsArkanWarningsTypes;
                if (
                    message.startsWith("[Arkan] No Recoil probable violation")
                ) {
                    if (isWithin24hours(activity.attributes.timestamp)) {
                        stats.anticheat.arkan.no_recoil_24h++;
                    }
                    stats.anticheat.arkan.no_recoil++;
                } else if (
                    message.startsWith("[Arkan] AIMBOT probable violation")
                ) {
                    if (isWithin24hours(activity.attributes.timestamp)) {
                        stats.anticheat.arkan.aimbot_24h++;
                    }
                    stats.anticheat.arkan.aimbot++;
                }
            }
            if (guardianWarnings) {
                const message = activity.attributes
                    .message as BattlemetricsGuardianWarningsTypes;
                if (message.includes(" for AntiCheat(")) {
                    if (isWithin24hours(activity.attributes.timestamp)) {
                        stats.anticheat.guardian.cheat_24h++;
                    }
                    stats.anticheat.guardian.cheat++;
                } else if (message.includes(" for AntiFlood")) {
                    if (isWithin24hours(activity.attributes.timestamp)) {
                        stats.anticheat.guardian.antiflood_24h++;
                    }
                    stats.anticheat.guardian.antiflood++;
                }
            }
        }
    }

    return {
        player: Player,
    };
}
