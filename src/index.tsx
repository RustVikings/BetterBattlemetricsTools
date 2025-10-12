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
    }, 100);
}

waitForElement("#RCONPlayerPage", (element: Element) => {
    // console.log("Element exists:", element);
    // Perform actions on the element
    const div = document.createElement("div");
    div.className = "BRT";
    element.prepend(div);
    const root = createRoot(div);
    root.render(<Panel />);
});
