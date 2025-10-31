import { getPlayerInfo } from "./apis/battlemetrics/";
import { getUserServers } from "./apis/battlemetrics/";
import { getPlayerActivity } from "./apis/battlemetrics/";
import { onGetPlayerActivity } from "./messaging/battlemetrics/";
import { onGetPlayerInfo } from "./messaging/battlemetrics/";
import { onGetServers } from "./messaging/battlemetrics/";
import {
    getSteamKillsDeaths,
    getSteamPlayerSummaries,
    getSteamPlaytime,
} from "./apis/steam/";
import {
    onGetPlayerSummaries,
    onGetSteamKillsDeaths,
    onGetSteamPlaytime,
} from "./messaging/steam/";
import { OwnServer } from "./types";
import Browser from "webextension-polyfill";

/** Handle extension installation event
 *
 * Opens the options page if required options are missing
 * from local storage
 */
Browser.runtime.onInstalled.addListener(() => {
    async function loadOptions() {
        await Browser.storage.local.get().then((options) => {
            if (
                !options.battlemetricsApiToken ||
                !options.steamApiKey ||
                !options.ownServers
            ) {
                Browser.runtime.openOptionsPage();
            }
        });
    }
    loadOptions();
});

// Listen for navigation events to detect page changes and render the panel
Browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
    /* Only act on the main frame */
    if (details.frameId === 0) {
        console.log("History state updated, sending message:", details.tabId);
        Browser.tabs.sendMessage(details.tabId, {
            action: "render-player-panel",
            details,
        });
    }
});

// Also listen for completed navigation events and render the panel
Browser.webNavigation.onCompleted.addListener((details) => {
    /* Only act on the main frame */
    if (details.frameId === 0) {
        Browser.tabs.sendMessage(details.tabId, {
            action: "render-player-panel",
            details,
        });
    }
});

/** Handle getServers message
 *
 * @param sendResponse - The function to send the response back to the caller
 * @param getServersArgs - The arguments for getting servers, including the Battlemetrics API token
 * @return - array of servers or undefined on error
 *
 * Calls the getUserServers function to fetch user servers from the Battlemetrics API
 */

onGetServers(
    async (
        sendResponse: CallableFunction,
        getServersArgs: { battlemetricsApiToken: string },
    ) => {
        try {
            const response = (await getUserServers(
                getServersArgs.battlemetricsApiToken,
            )) as { servers: Record<string, unknown> };
            return sendResponse({
                servers: response.servers,
            });
        } catch (error) {
            return sendResponse({
                servers: undefined,
            });
        }
    },
);

/** Handle getPlayerInfo message
 *
 * @param sendResponse - The function to send the response back to the caller
 * @param getPlayerInfoArgs - The arguments for getting player info, including the Battlemetrics API token, player ID, and own servers
 * @return - Player object or undefined on error
 *
 * Calls the getPlayerInfo asynchronous function to fetch player information from the Battlemetrics API
 */
onGetPlayerInfo(
    async (
        sendResponse: CallableFunction,
        getPlayerInfoArgs: {
            battlemetricsApiToken: string;
            playerId: string;
            ownServers: OwnServer[];
        },
    ) => {
        try {
            const Player = (await getPlayerInfo(
                getPlayerInfoArgs.battlemetricsApiToken,
                getPlayerInfoArgs.playerId,
                getPlayerInfoArgs.ownServers,
            )) as { player: typeof Player };
            return sendResponse({
                Player,
            });
        } catch (error) {
            return sendResponse({
                undefined,
            });
        }
    },
);

/** Handle getPlayerActivity message
 *
 * @param sendResponse - The function to send the response back to the caller
 * @param getPlayerActivityArgs - The arguments for getting player activity, including the Battlemetrics API token, player ID, and warning flags
 * @return - Player object or undefined on error
 *
 * Calls the getPlayerActivity asynchronous function to fetch player activity from the Battlemetrics API
 */
onGetPlayerActivity(
    async (
        sendResponse: CallableFunction,
        getPlayerActivityArgs: {
            battlemetricsApiToken: string;
            playerId: string;
            arkanWarnings: boolean;
            guardianWarnings: boolean;
        },
    ) => {
        try {
            const Player = (await getPlayerActivity(
                getPlayerActivityArgs.battlemetricsApiToken,
                getPlayerActivityArgs.playerId,
                getPlayerActivityArgs.arkanWarnings,
                getPlayerActivityArgs.guardianWarnings,
            )) as { activity: typeof Player };

            return sendResponse({
                Player,
            });
        } catch (error) {
            return sendResponse({
                undefined,
            });
        }
    },
);

/** Handle getPlayerSummaries message
 *
 * @param sendResponse - The function to send the response back to the caller
 * @param getPlayerSummariesArgs - The arguments for getting player summaries, including the Steam API key and Steam ID
 * @return - Player object or undefined on error
 *
 * Calls the getSteamPlayerSummaries asynchronous function to fetch player summaries from the Steam API
 */
onGetPlayerSummaries(
    async (
        sendResponse: CallableFunction,
        getPlayerSummariesArgs: { steamApiKey: string; steamID: string },
    ) => {
        try {
            const Player = (await getSteamPlayerSummaries(
                getPlayerSummariesArgs.steamApiKey,
                getPlayerSummariesArgs.steamID,
            )) as { profile: typeof Player };

            return sendResponse({
                Player,
            });
        } catch (error) {
            return sendResponse({
                undefined,
            });
        }
    },
);

/** Handle getSteamPlaytime message
 *
 * @param sendResponse - The function to send the response back to the caller
 * @param getSteamPlaytimeArgs - The arguments for getting Steam playtime, including the Steam API key and Steam ID
 * @return - Player object or undefined on error
 *
 * Calls the getSteamPlaytime asynchronous function to fetch playtime data from the Steam API
 */
onGetSteamPlaytime(
    async (
        sendResponse: CallableFunction,
        getSteamPlaytimeArgs: { steamApiKey: string; steamID: string },
    ) => {
        try {
            const Player = (await getSteamPlaytime(
                getSteamPlaytimeArgs.steamApiKey,
                getSteamPlaytimeArgs.steamID,
            )) as { activity: typeof Player };

            return sendResponse({
                Player,
            });
        } catch (error) {
            return sendResponse({
                undefined,
            });
        }
    },
);

/** Handle getSteamKillsDeaths message
 *
 * @param sendResponse - The function to send the response back to the caller
 * @param getSteamKillsDeathsArgs - The arguments for getting Steam kills/deaths, including the Steam API key and Steam ID
 * @return - Player object or undefined on error
 *
 * Calls the getSteamKillsDeaths asynchronous function to fetch kills/deaths data from the Steam API
 */
onGetSteamKillsDeaths(
    async (
        sendResponse: CallableFunction,
        getSteamKillsDeathsArgs: { steamApiKey: string; steamID: string },
    ) => {
        try {
            const Player = (await getSteamKillsDeaths(
                getSteamKillsDeathsArgs.steamApiKey,
                getSteamKillsDeathsArgs.steamID,
            )) as { activity: typeof Player };

            return sendResponse({
                Player,
            });
        } catch (error) {
            return sendResponse({
                undefined,
            });
        }
    },
);
