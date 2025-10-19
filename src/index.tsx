import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/app";
import { Panel } from "./components/panel/component";
import "./css/app.css";
import Browser from "webextension-polyfill";

function waitForElement(
    selector: string,
    callback: (element: Element) => void,
) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback(element);
        }
        console.log("Waiting for element:", selector);
    }, 500);
}

Browser.runtime.onMessage.addListener((message: any) => {
    if (message.action === "renderPanel") {
        waitForElement("#RCONPlayerPage", (element: Element) => {
            const extensionElement = document.getElementById("BRT");
            if (extensionElement) {
                console.log("Element .BRT already exists: rendering Panel");
                const root = createRoot(extensionElement);
                root.render(<Panel />);
            } else {
                console.log("Creating and rendering .BRT element");
                const div = document.createElement("div");
                div.id = "BRT";
                element.prepend(div);
                const root = createRoot(div);
                root.render(<Panel />);
            }
        });
    }
});
