import Browser from "webextension-polyfill";
import { onGetServers } from "./messaging/battlemetrics/getServers";
import { getMyServers } from "./apis/battlemetrics/getUserServers";

Browser.runtime.onInstalled.addListener(() => {
    let SETTINGS;

    console.log("SETTINGS");
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
            }),
    );
    return sendResponse({
        serverList,
    });
});
