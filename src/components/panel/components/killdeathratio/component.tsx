import React, { JSX, MouseEvent, use } from "react";
import { Tag } from "../tag";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    scales,
    elements,
    plugins,
    Color,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    plugins,
    Tooltip,
    Legend,
    ChartDataLabels,
    scales,
    elements,
    ChartDataLabels,
);

import classNames from "classnames";
import css from "../../styles.module.css";
import { Point } from "chart.js/dist/core/core.controller";
import { Font } from "chartjs-plugin-datalabels/types/options";
import Browser from "webextension-polyfill";

const icons = [new Image(12, 12), new Image(12, 12)];
icons[0].src = Browser.runtime.getURL("icons/kill.svg");
icons[1].src = Browser.runtime.getURL("icons/death.svg");

export const options = {
    responsive: true,
    scales: {
        x: {
            display: false,
        },
        y: {
            display: false,
        },
    },
    plugins: {
        datalabels: {
            color: "white",
            font: {
                weight: "bold" as Font["weight"],
                size: 14,
            },
            textAlign: "center" as const,
            align: "start" as const,
            anchor: "start" as const,
            clamp: true,
        },
        legend: {
            labels: {
                color: "white" as Color,
                padding: 12,
                textAlign: "center" as const,
            },
            onClick: (e: any): void => e.stopPropagation(),
        },
        tooltip: {
            enabled: false,
        },
    },
};

const labels = [""];

export const data = {
    labels,
    datasets: [
        {
            label: "Kills",
            data: [234],
            backgroundColor: "#548933",
            borderRadius: {
                topLeft: 4,
                topRight: 4,
            },
            legend: {
                usePointStyle: true,
                pointStyle: icons[0],
            },
        },
        {
            label: "Deaths",
            data: [587],
            backgroundColor: "#AA3333",
            borderRadius: {
                topLeft: 4,
                topRight: 4,
            },
            legend: {
                usePointStyle: true,
                pointStyle: icons[1],
            },
        },
    ],
};

export function KillDeathRatio(): JSX.Element {
    return (
        <div className={classNames(css.cols_2)}>
            <div className={classNames(css.widget)}>
                <div className={css.heading}>
                    <div className={css.title}>Last 24 hours</div>
                    <Tag value="K/D 1.0" severity="normal" />
                </div>
                <Bar options={options} data={data} />
            </div>
            <div className={classNames(css.widget)}>
                <div className={css.heading}>
                    <div className={css.title}>Total</div>
                    <Tag value="K/D 1.0" severity="danger" />
                </div>
                <Bar options={options} data={data} />
            </div>
        </div>
    );
}
