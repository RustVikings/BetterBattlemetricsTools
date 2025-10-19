import React, { JSX } from "react";
import css from "../../styles.module.css";
import classNames from "classnames";

interface DataPointProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string;
    severity?: "normal" | "warning" | "danger" | undefined;
    variant?: "default" | "inline";
}

export function DataPoint({
    label,
    value,
    severity,
}: DataPointProps): JSX.Element {
    return (
        <div
            className={
                severity === undefined
                    ? classNames(css.data_point)
                    : classNames(css.data_point, {
                          [css.severity_green]: severity === "normal",
                          [css.severity_amber]: severity === "warning",
                          [css.severity_red]: severity === "danger",
                      })
            }
        >
            <div className={css.data_point_label}>{label}</div>
            <div className={css.data_point_value}>{value}</div>
        </div>
    );
}
