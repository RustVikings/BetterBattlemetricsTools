import Browser from "webextension-polyfill";

let SETTINGS;

Browser.runtime.onInstalled.addListener(() => {
    if (!SETTINGS) {
        Browser.runtime.openOptionsPage();
    }
});
