import React, { JSX } from "react";
import { DataPoint } from "../datapoint";
import css from "../../styles.module.css";
import classNames from "classnames";
import { Playtime } from "../playtime";

export function PlayerInfo(): JSX.Element {
    return (
        <div className={classNames(css.section, css.cols_4)}>
            <div>
                <DataPoint
                    label="Steam profile visibility"
                    value="Public"
                    className={css.data_point}
                    severity="normal"
                />
                <DataPoint
                    label="Steam account age"
                    value="5 years & 9 months"
                />
                <DataPoint
                    label="First seen on Battlemetrics"
                    value="5 years ago"
                />
            </div>
            <div>
                <DataPoint
                    label="Cheating reports"
                    value="3 (7 last 24h)"
                    className={css.data_point}
                    severity="danger"
                />
                <DataPoint
                    label="Teaming Reports"
                    value="0 (0 last 24h)"
                    severity="normal"
                />
                <DataPoint
                    label="Teaming Reports"
                    value="0 (0 last 24h)"
                    severity="normal"
                />
            </div>
            <div>
                <DataPoint
                    label="EAC Banned IPs"
                    value="0"
                    className={css.data_point}
                    severity="normal"
                />
                <DataPoint
                    label="Battlemetrics Banned IPs"
                    value="0"
                    severity="normal"
                />
                <DataPoint
                    label="First seen on Battlemetrics"
                    value="5 years ago"
                />
            </div>
            {/* <div>
                <DataPoint
                    label="Steam profile visibility"
                    value="Public"
                    className={css.data_point}
                    severity="normal"
                />
                <DataPoint
                    label="Steam account age"
                    value="5 years & 9 months"
                />
                <DataPoint
                    label="First seen on Battlemetrics"
                    value="5 years ago"
                />
            </div> */}
            <div className="col-span-3">
                <Playtime />
            </div>
        </div>
    );
}
