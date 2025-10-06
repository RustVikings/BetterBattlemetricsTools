import Browser from "webextension-polyfill";

Browser.runtime.onMessage.addListener(function (
    msg: any,
    sender,
    sendResponse,
) {
    const div = document.createElement("div");
    div.innerText = msg;
    document.body.appendChild(div);
    return true;
});
