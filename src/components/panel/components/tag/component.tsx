import React, { JSX } from "react";
import classNames = require("classnames");
import css from "../../styles.module.css";

interface TagProps {
    value?: string;
    severity?: "normal" | "warning" | "danger" | "unknown" | "Loading...";
}

export function Tag({ value, severity }: TagProps): JSX.Element {
    return (
        <div
            className={classNames(css.tag, {
                [css.severity_green]: severity === "normal",
                [css.severity_amber]: severity === "warning",
                [css.severity_red]: severity === "danger",
                [css.severity_unknown]: severity === "unknown",
            })}
        >
            {value}
        </div>
    );
}
