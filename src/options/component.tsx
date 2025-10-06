import Browser from "webextension-polyfill";

Browser.runtime.onMessage.addListener(function (msg, sender, sendMessage) {
    alert(msg);
    return true;
});
