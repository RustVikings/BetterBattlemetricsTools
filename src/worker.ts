import Browser from "webextension-polyfill";
import { onGetServers } from "./messaging/battlemetrics/getServers";
import { onGetOptions } from "./messaging/internal/getOptions";
import { getMyServers } from "./apis/battlemetrics/getUserServers";

Browser.runtime.onInstalled.addListener(() => {
    console.log("Extention loaded: Better Battlemetrics Tools");
    let SETTINGS;

    if (!SETTINGS) {
        Browser.runtime.openOptionsPage();
    } else {
    }
});

onGetServers(async (sendResponse: CallableFunction, battlemetrics) => {
    let serverList;
    await fetch(
        `https://api.battlemetrics.com/servers?filter[rcon]=true&page[size]=100&access_token=${battlemetrics.key}`,
    ).then((apiResponse) =>
        apiResponse
            .json()
            .then((toJson) => ({
                servers: toJson.data,
            }))
            .then((res) => {
                serverList = res;
            })
            .catch(() => {
                return false;
            }),
    );
    return sendResponse({
        serverList,
    });
});

onGetOptions(async (sendResponse: CallableFunction) => {
    console.log("worker: Fetching options...");
    const Options = await Browser.storage.local.get();
    console.log("worker: Options fetched", Options);
    return sendResponse({
        Options,
    });
});
