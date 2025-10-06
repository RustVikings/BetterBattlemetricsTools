import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/app";
import "./css/app.css";

const OPTIONS_CONTAINER = createRoot(
    document.getElementById("options_container")!,
);

OPTIONS_CONTAINER.render(<App />);
