import { createRoot } from "react-dom/client";
import { Panel } from "./components/panel/component";
import "./css/app.css";
import Browser from "webextension-polyfill";

// Utility function to wait for an element to appear in the DOM
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

// Listen for messages from the background script
Browser.runtime.onMessage.addListener((message: any) => {
    if (message.action === "render-player-panel") {
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
