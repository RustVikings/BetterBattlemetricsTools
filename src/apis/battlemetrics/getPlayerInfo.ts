import {
    BattlemetricsCurrentServer,
    BattlemetricsCurrentServerAttributes,
    BattlemetricsPlayerStats,
    OwnServer,
    Player,
    PlayerProfile,
} from "@src/types";
import { secondsToHours } from "@src/utils/time";

export async function getPlayerInfo(
    battlemetricsApiToken: string,
    playerId: string,
    ownServers: OwnServer[],
): Promise<unknown> {
    const apiResponse = await fetch(
        `https://api.battlemetrics.com/players/${playerId}?include=server,identifier&fields[server]=name,ip,port&filter[identifiers]=steamID&access_token=${battlemetricsApiToken}`,
    );
    const toJson = await apiResponse.json();

    const Player: Player = {} as Player;
    let servers_played = 0;

    /* Get the player's Steam ID */
    const steamID = toJson.included.find(
        (identifier: { type: string; attributes: { type: string } }) =>
            identifier.type === "identifier" &&
            identifier.attributes.type === "steamID",
    )?.attributes.identifier;

    /* save steamID to Player object */
    Player.steamID = steamID;

    /* save player ID to Player object */
    Player.id = playerId;

    /* get the player's battlemetrics profile */
    const profile = toJson.data.attributes;

    /* Initialize Player object */
    Player.profile = {} as PlayerProfile;
    Player.stats = {
        playtime: {
            battlemetrics: 0,
            yourservers: 0,
            aim: 0,
        },
        servers_played: 0,
    } as BattlemetricsPlayerStats;
    Player.current_server = {
        online: false,
        attributes: {} as BattlemetricsCurrentServerAttributes,
    } as BattlemetricsCurrentServer;

    /* save battlemetrics profile to Player object */
    Player.profile.battlemetrics = profile;

    for (const server of toJson.included.filter(
        (item: { type: string }) => item.type === "server",
    )) {
        const game = server.relationships.game.data.id;
        /* check if the game is rust */
        if (game === "rust") {
            /* increment servers played and add to battlemetrics playtime */
            servers_played++;
            /* add server played time to total battlemetrics playtime */
            Player.stats.playtime.battlemetrics += secondsToHours(
                server.meta.timePlayed as number,
            );
            /* check if the server is one of the user's servers */
            const server_name = server.attributes.name.toLowerCase();
            if (
                ownServers.some(
                    (s) => s.server.name.toLowerCase() === server_name,
                )
            ) {
                Player.stats.playtime.yourservers += secondsToHours(
                    server.meta.timePlayed as number,
                );
            }
            /* infer aim playtime from server name and add to total aim playtime */
            if (server_name.includes("aim") || server_name.includes("ukn")) {
                Player.stats.playtime.aim += secondsToHours(
                    server.meta.timePlayed as number,
                );
            }
            /* check if the player is currently online on this server */
            if (server.meta.online) {
                Player.current_server = {
                    online: true,
                    attributes: {
                        name: server.attributes.name,
                        ip: server.attributes.ip,
                        port: server.attributes.port,
                        joined: new Date(server.meta.lastSeen as string),
                    },
                };
            }
        }
    }

    Player.stats.servers_played = servers_played;

    return {
        player: Player,
    };
}
