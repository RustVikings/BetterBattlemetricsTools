import React, { JSX } from "react";
import css from "../../styles.module.css";
import classNames from "classnames";
import Browser from "webextension-polyfill";

interface DataPointProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string | number;
    title?: string;
    severity?: "normal" | "warning" | "danger" | "unknown" | "Loading...";
    variant?: "default" | "inline";
    layout?: "vertical" | "horizontal";
    alignment?: "left" | "center" | "right";
    href?: string;
    copy?: boolean;
}

const linkImg = Browser.runtime.getURL("./icons/link.svg");
const copyImg = Browser.runtime.getURL("./icons/copy.svg");

export function DataPoint({
    label,
    value,
    title,
    severity,
    layout = "vertical",
    alignment = "left",
    href,
    copy,
}: DataPointProps): JSX.Element {
    const handleCopy = () => {
        navigator.clipboard.writeText(String("client.connect " + value));
    };

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
                {href ? (
                    <a href={href} target="_blank" rel="noreferrer">
                        {value}
                        <img
                            className="siz"
                            src={linkImg}
                            style={{
                                display: "inline",
                                width: "18px",
                                height: "18px",
                                marginLeft: "4px",
                            }}
                        />
                    </a>
                ) : (
                    value
                )}
                {copy ? (
                    <button
                        className={css.serverAddressCopyButton}
                        onClick={handleCopy}
                        title={"Copy to clipboard: client.connect " + value}
                    >
                        <img
                            className="siz"
                            src={copyImg}
                            style={{
                                display: "inline",
                                width: "18px",
                                height: "18px",
                                marginLeft: "4px",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                navigator.clipboard.writeText(String(value));
                            }}
                        />
                    </button>
                ) : null}
            </div>
        </div>
    );
}
