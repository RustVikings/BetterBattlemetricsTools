import React, { Fragment } from "react";
import { Options } from "../options";
import Browser from "webextension-polyfill";

const message: string = "Yo! What's up!";

/* const handleClick = async () => {
    const tabs = await Browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    const activeTab = tabs[0];
    Browser.tabs.sendMessage(activeTab.id || 0, message);
}; */

export function App(): React.JSX.Element {
    return (
        <Options />
        // <button onClick={handleClick}>Button</button> */
    );
}
