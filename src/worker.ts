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
import { get } from "http";

// Handle extension installation,
// try to load settings
// and open options page if no settings found
Browser.runtime.onInstalled.addListener(() => {
    async function loadSettings() {
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
    loadSettings();
});

// Listen for navigation events to detect page changes and render the panel
Browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
    Browser.tabs.sendMessage(details.tabId, {
        action: "render-player-panel",
        details,
    });
});

// Also listen for completed navigation events and render the panel
Browser.webNavigation.onCompleted.addListener((details) => {
    Browser.tabs.sendMessage(details.tabId, {
        action: "render-player-panel",
        details,
    });
});

// Handle getServers message
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

// Handle getPlayerInfo message
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

            console.log("Steam Kills/Deaths Player Data:", Player);

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
