import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "../components/app";
import waitForElement from "../utils/waitforelement";
import "../css/options.css";

waitForElement("#options_container", (element: Element) => {
    const OPTIONS_CONTAINER = document.getElementById("options_container")!;
    const ROOT = createRoot(OPTIONS_CONTAINER);
    ROOT.render(<App />);
});
