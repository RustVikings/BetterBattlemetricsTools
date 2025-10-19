import React, { JSX } from "react";
import classNames from "classnames";
import css from "../../styles.module.css";
import { Tag } from "../tag";
import { DataPoint } from "../datapoint";

export function Playtime(): JSX.Element {
    return (
        <div className={classNames(css.play_time, css.widget, "w-full")}>
            <div className={css.heading}>
                <div className={css.title}>Playtime (hours)</div>
                <Tag value="Boosted by 122%" severity="danger" />
            </div>
            <div className={css.cols_2}>
                <DataPoint label="on your servers" value="5.4" />
                <DataPoint label="Servers played" value="5.4" />
            </div>
            <div className={css.cols_3}>
                <DataPoint label="Steam" value="5.4" />
                <DataPoint label="Battlemetrics" value="18.2" />
                <DataPoint label="Aim train" value="65.7" />
            </div>
        </div>
    );
}
