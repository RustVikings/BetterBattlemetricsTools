import { PlayerActivity } from "../components/panel/component";

export function isWithin24hours(date: any) {
    const timeStamp = Math.round(new Date().getTime() / 1000);
    const timeStampYesterday = timeStamp - 24 * 3600;
    return date >= new Date(timeStampYesterday * 1000).getTime();
}

export function getPlayerStats(
    activity: PlayerActivity | undefined,
    playerId: string | undefined,
): any | null {
    if (!activity || !playerId) return null;

    // console.log("Player Activity:", activity, playerId);

    let stats = {
        kills: 0,
        deaths: 0,
        kd: 0,
        kills24h: 0,
        deaths24h: 0,
        kd24h: 0,
        reports: {
            cheat: 0,
            cheat24h: 0,
            teaming: 0,
            teaming24h: 0,
            other: 0,
            other24h: 0,
        },
    };

    // console.log("Activity Data:", activity);

    let processedEvents = 0;

    for (const event of activity.data) {
        const messageType = event.attributes?.messageType;
        const data = event.attributes?.data;
        const within24hours = isWithin24hours(
            new Date(event.attributes?.timestamp),
        );

        // console.log("Processing event:", data, "Type:", messageType);

        processedEvents++;

        switch (messageType) {
            case "rustLog:playerDeath:PVP":
                if ((data.killer_id as string) == playerId) {
                    // console.log("Incrementing kill for event:", data);
                    stats.kills++;
                    if (within24hours) stats.kills24h++;
                } else if ((data.player_id as string) == playerId) {
                    // console.log("Incrementing death for event:", data);
                    stats.deaths++;
                    if (within24hours) stats.deaths24h++;
                }
                break;
            case "rustLog:playerReport":
                // console.log("Processing report event:", data);
                switch (data.reportType) {
                    case "cheat":
                        if ((data.forPlayerId as string) == playerId) {
                            stats.reports.cheat++;
                            if (within24hours) stats.reports.cheat24h++;
                        }
                        break;
                    case "teaming":
                        if ((data.forPlayerId as string) == playerId) {
                            stats.reports.teaming++;
                            if (within24hours) stats.reports.teaming24h++;
                        }
                        break;
                    case "other":
                        if ((data.forPlayerId as string) == playerId) {
                            stats.reports.other++;
                            if (within24hours) stats.reports.other24h++;
                        }
                        break;
                    default:
                }
                break;
            default:
            // console.log("Unknown event type:", messageType);
            // if (messageType === "rustLog:playerDeath:PVP") {
            //     console.log(
            //         "killer_id:",
            //         typeof data.killer_id,
            //         "playerId:",
            //         typeof playerId,
            //     );
            //     if ((data.killer_id as string) == playerId) {
            //         console.log("Incrementing kill for event:", data);
            //         stats.kills++;
            //         if (within24hours) stats.kills24h++;
            //     } else if ((data.player_id as string) == playerId) {
            //         console.log("Incrementing death for event:", data);
            //         stats.deaths++;
            //         if (within24hours) stats.deaths24h++;
            //     }
            // }
        }
        stats.kd = stats.kills / (stats.deaths || 1);
        stats.kd24h = stats.kills24h / (stats.deaths24h || 1);
    }
    // console.log("Report event data:", stats, processedEvents);
    return stats;
}
