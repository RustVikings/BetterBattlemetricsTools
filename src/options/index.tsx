import React from "react";
import { createRoot } from "react-dom/client";
import { Options } from "../components/options";
import waitForElement from "../utils/waitforelement";
import "../css/options.css";

waitForElement("#options_container", () => {
    const OPTIONS_CONTAINER = document.getElementById("options_container");
    if (OPTIONS_CONTAINER) {
        const ROOT = createRoot(OPTIONS_CONTAINER);
        ROOT.render(<Options />);
    }
});
