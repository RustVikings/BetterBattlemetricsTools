import { createRoot } from "react-dom/client";
import React from "react";
import { Panel } from "./components/panel/component";
import "./css/app.css";
import Browser from "webextension-polyfill";
import waitForElement from "./utils/waitforelement";

// Listen for messages from the background script
Browser.runtime.onMessage.addListener((message: unknown) => {
    if ((message as { action: string }).action === "render-player-panel") {
        waitForElement("#RCONPlayerPage", (element: Element) => {
            // Check if the extension element already exists
            const extensionElement = document.getElementById("BRT");
            if (extensionElement) {
                // If it exists, just render the Panel into it
                const root = createRoot(extensionElement);
                root.render(<Panel />);
            } else {
                // If it doesn't exist, create it and then render the Panel
                const div = document.createElement("div");
                div.id = "BRT";
                element.prepend(div);
                const root = createRoot(div);
                root.render(<Panel />);
            }
        });
    }
});
