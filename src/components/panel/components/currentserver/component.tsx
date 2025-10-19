import React, { JSX } from "react";
import { DataPoint } from "../datapoint";
import css from "../../styles.module.css";
import classNames from "classnames";
import { KillDeathRatio } from "../killdeathratio/component";

export function CurrentServer(): JSX.Element {
    return (
        <div className={classNames(css.section, css.cols_2)}>
            <div>
                <DataPoint
                    label="Current Server"
                    value="RustVikings | Solo/Duo | Wednesdays | FULLWIPED 15/10 18:00CEST"
                />
                <DataPoint
                    label="Server address"
                    value="client.connect 193.25.252.119:28016"
                />
                <DataPoint label="Join time" value="2.2 hours ago" />
            </div>
            <div>
                <KillDeathRatio />
            </div>
        </div>
    );
}
