import { createRoot, Root } from "react-dom/client";
import React, { StrictMode } from "react";
import { Panel } from "./components/panel/component";
import "./css/app.css";
import Browser from "webextension-polyfill";
import waitForElement from "./utils/dom";

let root: Root = {} as Root;

console.log("Better Battelemetrics Tools: Loaded");

// Listen for messages from the background script
Browser.runtime.onMessage.addListener((message: unknown) => {
    if ((message as { action: string }).action === "render-player-panel") {
        waitForElement("#RCONPlayerPage", (element: Element) => {
            // Check if the extension element already exists
            const extensionElement = document.getElementById("BRT");

            if (extensionElement) {
                if (root === ({} as Root)) {
                    // console.log("Creating new root for existing element");
                    root = createRoot(extensionElement);
                }
            } else {
                const div = document.createElement("div");
                div.id = "BRT";
                element.prepend(div);
                // console.log("Creating new root for new element");
                root = createRoot(div);
            }
            // console.log("root:", root);
            root.render(<Panel />);
        });
    }
});
