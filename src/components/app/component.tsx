import React, { Fragment, useContext } from "react";
import { Options } from "../options";

/* const handleClick = async () => {
    const tabs = await Browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    const activeTab = tabs[0];
    Browser.tabs.sendMessage(activeTab.id || 0, message);
}; */

export function App(): React.JSX.Element {
    return <Options />;
}
