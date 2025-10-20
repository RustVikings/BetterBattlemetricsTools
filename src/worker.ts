import { getPlayerInfo } from "./apis/battlemetrics/getPlayerInfo";
import { getUserServers } from "./apis/battlemetrics/getUserServers";
import { getSteamProfile } from "./apis/battlemetrics/getSteamProfile";
import { onGetSteamProfile } from "./messaging/battlemetrics/getSteamProfile";
import { onGetSettings } from "./messaging/internal/getSettings";
import { onGetPlayerInfo } from "./messaging/battlemetrics/getPlayerInfo";
import { onGetServers } from "./messaging/battlemetrics/getServers";
import Browser from "webextension-polyfill";
import { onGetPlayerSummaries } from "./messaging/steam/getPlayerSummaries";
import { getPlayerSummaries } from "./apis/steam/getPlayerSummaries";
import { getPlayerActivity } from "./apis/battlemetrics/getPlayerActivity";

// Handle extension installation,
// try to load settings
// and open options page if no settings found
Browser.runtime.onInstalled.addListener(() => {
    const SETTINGS = async function loadSettings() {
        return Browser.storage.local.get();
    };

    if (!SETTINGS) {
        Browser.runtime.openOptionsPage();
    } else {
    }
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

// Handle getSettings message
onGetSettings(async (sendResponse: CallableFunction) => {
    try {
        const options = await Browser.storage.local.get();
        return sendResponse({
            Options: options,
        });
    } catch (error) {
        return sendResponse({
            Options: null,
        });
    }
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
                servers: null,
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
        },
    ) => {
        try {
            const playerInfo = (await getPlayerInfo(
                getPlayerInfoArgs.battlemetricsApiToken,
                getPlayerInfoArgs.playerId,
            )) as { player: string };
            console.log("worker: playerInfo", playerInfo);
            const playerActivity = (await getPlayerActivity(
                getPlayerInfoArgs.battlemetricsApiToken,
                getPlayerInfoArgs.playerId,
            )) as { activity: string };
            console.log("worker: playerActivity", playerActivity);
            return sendResponse({
                player: playerInfo.player,
                activity: playerActivity?.activity,
            });
        } catch (error) {
            return sendResponse({
                player: null,
                activity: null,
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
            const profile = await getPlayerSummaries(
                getPlayerSummariesArgs.steamApiKey,
                getPlayerSummariesArgs.steamID,
            );
            return sendResponse({
                player: profile,
            });
        } catch (error) {
            return sendResponse({
                player: null,
            });
        }
    },
);
