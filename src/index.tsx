import { createRoot, Root } from "react-dom/client";
import React from "react";
import { Panel } from "./components/panel/component";
import "./css/app.css";
import Browser from "webextension-polyfill";
import waitForElement from "./utils/dom";
import { getPlayerInfo } from "./messaging/battlemetrics";
import {
    hasIdentifierSources,
    registerIdentifierEnrichment,
} from "./utils/enrichIdentifiers";
import { Options } from "./types";

let root: Root = {} as Root;

/* Players whose IPs we've already fetched for standalone enrichment, so
 * repeated navigation messages don't re-fetch. */
const standaloneFetched = new Set<string>();


/**
 * Enrich the dedicated `/identifiers` tab when it is loaded/refreshed directly.
 *
 * On that route the overview container (#RCONPlayerPage) is absent, so the React
 * panel never mounts and its enrichment never starts. Here we fetch the player's
 * IPs ourselves and register them with the shared enricher. Skipped when the
 * panel is already handling enrichment, to avoid a duplicate API call.
 */
async function enrichIdentifiersTab(playerId: string): Promise<void> {
    if (hasIdentifierSources() || standaloneFetched.has(playerId)) return;
    standaloneFetched.add(playerId);

    const options = (await Browser.storage.local.get()) as Options;
    if (!options?.battlemetricsApiToken) return;

    const response = await getPlayerInfo({
        battlemetricsApiToken: options.battlemetricsApiToken,
        playerId,
        ownServers: options.ownServers ?? [],
    });

    const ips = response?.Player?.player?.ips ?? [];
    if (ips.length === 0) return;

    registerIdentifierEnrichment(() => ips);
}

// Listen for messages from the background script
Browser.runtime.onMessage.addListener((message: unknown) => {
    if ((message as { action: string }).action === "render-player-panel") {
        /* Dedicated identifiers tab (no overview panel): enrich standalone. */
        const identifiersMatch = window.location.href.match(
            /\/rcon\/players\/(\d+)\/identifiers/,
        );
        if (identifiersMatch) {
            enrichIdentifiersTab(identifiersMatch[1]);
        }

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
