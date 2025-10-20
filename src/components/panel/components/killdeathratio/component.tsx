import React, { JSX, useContext } from "react";
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
import { Font } from "chartjs-plugin-datalabels/types/options";
import Browser from "webextension-polyfill";
import { PlayerContext } from "../..";

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
    minBarLength: 32,
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

interface KillDeathRatioProps {
    title?: string;
    kdRatio?: number;
    period?: "24h" | "total";
}

const kdRatioSeverity = (kdRatio: number) => {
    const kd = parseFloat(kdRatio);
    switch (true) {
        case kd > 1.5:
            return "danger";
        case kd > 1 && kd <= 1.5:
            return "warning";
        default:
            return "normal";
    }
};

export function KillDeathRatio({
    title,
    kdRatio,
    period,
}: KillDeathRatioProps): JSX.Element {
    const player = useContext(PlayerContext);
    const stats = player?.playerStats;
    const labels = [""];

    const data = {
        labels,
        datasets: [
            {
                label: "Kills",
                data: [period === "24h" ? stats?.kills24h : stats?.kills || 0],
                backgroundColor: "#8E8E8E",
                borderRadius: {
                    topLeft: 4,
                    topRight: 4,
                },
                legend: {
                    labels: {
                        usePointStyle: true,
                        pointStyle: icons[0],
                    },
                },
            },
            {
                label: "Deaths",
                data: [
                    period === "24h" ? stats?.deaths24h : stats?.deaths || 0,
                ],
                backgroundColor: "#3C3C3C",
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

    return (
        <div className={classNames(css.widget)}>
            <div className={css.heading}>
                <div className={css.title}>{title}</div>
                <Tag
                    value={`K/D ${kdRatio}`}
                    severity={kdRatioSeverity(kdRatio as number)}
                />
            </div>
            <Bar options={options} data={data} />
        </div>
    );
}
