import { getPlayerInfo } from "./apis/battlemetrics/getPlayerInfo";
import { getUserServers } from "./apis/battlemetrics/getUserServers";
import { getSteamProfile } from "./apis/battlemetrics/getSteamProfile";
import { onGetSteamProfile } from "./messaging/battlemetrics/getSteamProfile";
import { onGetOptions } from "./messaging/internal/getOptions";
import { onGetPlayerInfo } from "./messaging/battlemetrics/getPlayerInfo";
import { onGetServers } from "./messaging/battlemetrics/getServers";
import Browser from "webextension-polyfill";

Browser.runtime.onInstalled.addListener(() => {
    let SETTINGS;

    if (!SETTINGS) {
        Browser.runtime.openOptionsPage();
    } else {
    }
});

Browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
    console.log("webNavigation onCompleted:", details);
    Browser.tabs.sendMessage(details.tabId, {
        action: "renderPanel",
        details,
    });
});

Browser.webNavigation.onCompleted.addListener((details) => {
    console.log("webNavigation onCompleted:", details);
    Browser.tabs.sendMessage(details.tabId, {
        action: "renderPanel",
        details,
    });
});

onGetOptions(async (sendResponse: CallableFunction) => {
    try {
        const options = await Browser.storage.local.get();
        console.log("worker: options fetched", options);
        return sendResponse({
            Options: options,
        });
    } catch (error) {
        console.error("Error fetching options:", error);
        return sendResponse({
            Options: null,
        });
    }
});

onGetServers(
    async (
        sendResponse: CallableFunction,
        getServersArgs: { battlemetricsApiToken: string },
    ) => {
        try {
            console.log("worker: getUserServers called", getServersArgs);
            const response = (await getUserServers(
                getServersArgs.battlemetricsApiToken,
            )) as { servers: Record<string, unknown> };
            return sendResponse({
                servers: response.servers,
            });
        } catch (error) {
            console.error("Error fetching servers:", error);
            return sendResponse({
                servers: null,
            });
        }
    },
);

onGetPlayerInfo(
    async (
        sendResponse: CallableFunction,
        getPlayerInfoArgs: {
            battlemetricsApiToken: string;
            playerId: string;
        },
    ) => {
        try {
            const response = (await getPlayerInfo(
                getPlayerInfoArgs.battlemetricsApiToken,
                getPlayerInfoArgs.playerId,
            )) as { steamID: string };
            return sendResponse({
                player: response.steamID,
            });
        } catch (error) {
            console.error("Error fetching player:", error);
            return sendResponse({
                player: null,
            });
        }
    },
);
onGetSteamProfile(
    async (
        sendResponse: CallableFunction,
        getSteamProfileArgs: { steamID: string; steamApiKey: string },
    ) => {
        try {
            const response = (await getSteamProfile(
                getSteamProfileArgs.steamID,
                getSteamProfileArgs.steamApiKey,
            )) as unknown as { profile: Record<string, unknown> };
            return sendResponse({
                profile: response.profile,
            });
        } catch (error) {
            console.error("Error fetching Steam profile:", error);
            return sendResponse({
                profile: null,
            });
        }
    },
);
