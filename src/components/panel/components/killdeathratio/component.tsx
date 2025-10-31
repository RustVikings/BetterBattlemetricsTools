import React, { JSX, use, useContext } from "react";
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
import { LoadingContext, PlayerContext } from "@src/components/panel/";
import { LoadingState, Player } from "@src/types";

/* create icon elements */
const icons = [new Image(12, 12), new Image(12, 12)];
/* load kill/death icons */
icons[0].src = Browser.runtime.getURL("icons/kill.svg");
icons[1].src = Browser.runtime.getURL("icons/death.svg");

export const options = {
    elements: {
        point: {
            usePointStyle: true,
            pointStyle: [icons[0], icons[1]],
        },
    },
    responsive: true,
    layout: {
        padding: 0,
    },
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
                usePointStyle: true,
                pointStyle: "circle" as const,
                pointStyleWidth: 20,
                borderRadius: 4,
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
    kdRatio?: string;
    period?: "24h" | "total";
}

const kdRatioSeverity = (kdRatio: string) => {
    const kd = parseFloat(kdRatio);
    switch (true) {
        case kd >= 3:
            return "danger";
        case kd > 1 && kd < 3:
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
    const labels = [""];

    /* Load relevant data Contexts */
    const Player = useContext(PlayerContext) as Player;
    const Loading = useContext(LoadingContext) as LoadingState;
    const kd = Player.stats.kd;

    // // console.log("Player", Player);

    const data = {
        labels,
        datasets: [
            {
                label: "Kills",
                data: [
                    !Loading.playerActivity
                        ? period === "24h"
                            ? kd.kills_24h
                            : kd.kills
                        : 0,
                ],
                backgroundColor: "#ca3d3d",
                borderRadius: {
                    topLeft: 4,
                    topRight: 4,
                },
            },
            {
                label: "Deaths",
                data: [
                    !Loading.playerActivity
                        ? period === "24h"
                            ? kd.deaths_24h
                            : kd.deaths
                        : 0,
                ],
                backgroundColor: "#61a138",
                borderRadius: {
                    topLeft: 4,
                    topRight: 4,
                },
            },
        ],
    };

    return (
        <div className={classNames(css.widget)}>
            <div className={css.heading}>
                <div className={css.title}>{title}</div>
                <Tag
                    value={
                        Loading.playerActivity ? "Loading..." : `K/D ${kdRatio}`
                    }
                    severity={
                        Loading.playerActivity
                            ? "Loading..."
                            : kdRatioSeverity(kdRatio || "0")
                    }
                />
            </div>
            <Bar options={options} data={data} />
        </div>
    );
}
