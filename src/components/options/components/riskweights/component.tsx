import React, { ChangeEvent, JSX } from "react";
import css from "../../styles.module.css";
import { RiskConfig, RiskWeightKey } from "@src/utils/risk";

/** Human-readable labels for each tunable weight. */
const WEIGHT_LABELS: Record<RiskWeightKey, string> = {
    arkanAimbot: "Arkan aimbot hit",
    arkanNoRecoil: "Arkan no-recoil hit",
    guardianCheat: "Guardian cheat hit",
    guardianAntiflood: "Guardian anti-flood hit",
    reportCheat: "Cheating report",
    reportTeamingOrOther: "Teaming / other report",
    privateProfile: "Private Steam profile",
    accountVeryNew: "New Steam account (<30d)",
    accountNew: "Young Steam account (<90d)",
    highCheatReportRate: "High cheat-report rate",
};

/** Weights that only apply when their source anticheat plugin is enabled. */
const WEIGHT_REQUIRES: Partial<Record<RiskWeightKey, "arkan" | "guardian">> = {
    arkanAimbot: "arkan",
    arkanNoRecoil: "arkan",
    guardianCheat: "guardian",
    guardianAntiflood: "guardian",
};

interface RiskWeightsProps {
    config: RiskConfig;
    arkanEnabled: boolean;
    guardianEnabled: boolean;
    onChange: (
        section: "weights" | "thresholds",
        key: string,
        value: number,
    ) => void;
    onReset: () => void;
}

const numberInputStyle: React.CSSProperties = {
    width: "72px",
    textAlign: "right",
};

const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "4px 0",
};

/**
 * Options-page control for tuning the risk scoring model. Each weight is the
 * points added per occurrence of a signal; the thresholds set where the badge
 * flips to Watch / High risk. Values are stored per-admin so scoring can be
 * tailored without touching code.
 */
export function RiskWeights({
    config,
    arkanEnabled,
    guardianEnabled,
    onChange,
    onReset,
}: RiskWeightsProps): JSX.Element {
    const handleNumber =
        (section: "weights" | "thresholds", key: string) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            const value = parseFloat(e.target.value);
            onChange(section, key, Number.isFinite(value) ? value : 0);
        };

    const isWeightVisible = (key: RiskWeightKey): boolean => {
        const requires = WEIGHT_REQUIRES[key];
        if (requires === "arkan") return arkanEnabled;
        if (requires === "guardian") return guardianEnabled;
        return true;
    };

    return (
        <div>
            <p className={css.permissions}>
                Points added per signal. Higher = more weight. A player scores
                Watch at the watch threshold and High risk at the high
                threshold.
            </p>

            {(Object.keys(config.weights) as RiskWeightKey[])
                .filter(isWeightVisible)
                .map((key) => (
                    <div key={key} style={rowStyle}>
                        <label htmlFor={`weight-${key}`}>
                            {WEIGHT_LABELS[key] ?? key}
                        </label>
                        <input
                            id={`weight-${key}`}
                            type="number"
                            min={0}
                            step={0.5}
                            style={numberInputStyle}
                            value={config.weights[key]}
                            onChange={handleNumber("weights", key)}
                        />
                    </div>
                ))}

            <div style={rowStyle}>
                <label htmlFor="threshold-watch">Watch threshold</label>
                <input
                    id="threshold-watch"
                    type="number"
                    min={0}
                    step={1}
                    style={numberInputStyle}
                    value={config.thresholds.watch}
                    onChange={handleNumber("thresholds", "watch")}
                />
            </div>
            <div style={rowStyle}>
                <label htmlFor="threshold-high">High-risk threshold</label>
                <input
                    id="threshold-high"
                    type="number"
                    min={0}
                    step={1}
                    style={numberInputStyle}
                    value={config.thresholds.high}
                    onChange={handleNumber("thresholds", "high")}
                />
            </div>

            <button
                type="button"
                onClick={onReset}
                style={{ marginTop: "8px" }}
            >
                Reset to defaults
            </button>
        </div>
    );
}
