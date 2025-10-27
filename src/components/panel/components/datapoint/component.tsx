import React, { JSX } from "react";
import css from "../../styles.module.css";
import classNames from "classnames";

interface DataPointProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string | number;
    title?: string;
    severity?: "normal" | "warning" | "danger" | "unknown" | "Loading...";
    variant?: "default" | "inline";
    layout?: "vertical" | "horizontal";
    alignment?: "left" | "center" | "right";
}

export function DataPoint({
    label,
    value,
    title,
    severity,
    layout = "vertical",
    alignment = "left",
}: DataPointProps): JSX.Element {
    return (
        <div
            className={
                layout === "horizontal"
                    ? classNames(css.data_point, {
                          [css.align_left]: alignment === "left",
                          [css.align_center]: alignment === "center",
                          [css.align_right]: alignment === "right",
                          [css.layout_horizontal]: layout === "horizontal",
                      })
                    : classNames(css.data_point, {
                          [css.align_left]: alignment === "left",
                          [css.align_center]: alignment === "center",
                          [css.align_right]: alignment === "right",
                          [css.layout_vertical]: layout === "vertical",
                      })
            }
        >
            <div className={css.data_point_label}>{label}</div>
            <div
                className={classNames(css.data_point_value, {
                    [css.severity_green]: severity === "normal",
                    [css.severity_amber]: severity === "warning",
                    [css.severity_red]: severity === "danger",
                    [css.severity_unknown]: severity === "unknown",
                })}
                title={title}
            >
                {value}
            </div>
        </div>
    );
}
