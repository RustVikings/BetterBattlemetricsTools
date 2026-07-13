import React, { JSX, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import css from "../../styles.module.css";
import { LoadingContext, OptionsContext, PlayerContext } from "../../component";
import { LoadingState, Options, Player } from "@src/types";
import {
    computeRisk,
    resolveRiskConfig,
    riskSeverity,
    RiskLevel,
} from "@src/utils/risk";
import {
    computeDeltas,
    getLastSnapshot,
    MetricDelta,
    saveSnapshot,
    toVisitMetrics,
} from "@src/utils/visitHistory";
import { fromNow } from "@src/utils/time";

const LEVEL_LABEL: Record<RiskLevel, string> = {
    low: "Low risk",
    watch: "Watch",
    high: "High risk",
};

const POPOVER_ID = "brt-risk-detail";

/** Format a points value without trailing ".0". */
function fmtPoints(value: number): string {
    return value % 1 === 0 ? String(value) : value.toFixed(1);
}

type DeltaInfo = { lastTs: number | null; deltas: MetricDelta[] };

export function RiskBadge(): JSX.Element {
    const Player = useContext(PlayerContext) as Player;
    const Loading = useContext(LoadingContext) as LoadingState;
    const Options = useContext(OptionsContext) as Options;

    const [deltaInfo, setDeltaInfo] = useState<DeltaInfo | null>(null);
    /* steamID we've already snapshotted, so we process once per player even if
     * the panel persists across SPA navigation between profiles. */
    const processedSteamIdRef = useRef<string | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    /* Score depends on activity (anticheat/reports) and the Steam profile.
     * Wait for both so the badge doesn't flash a misleadingly-clean value. */
    const ready = !Loading.playerActivity && !Loading.steamProfile;

    const config = resolveRiskConfig(Options?.riskConfig);
    const risk = computeRisk(Player, config);

    /* Once data is ready, diff against the last visit and record a new snapshot.
     * Guarded to run once per mount so auto-refresh doesn't churn storage. */
    useEffect(() => {
        if (!ready) return;
        const steamID = Player.steamID;
        if (!steamID || processedSteamIdRef.current === steamID) return;
        processedSteamIdRef.current = steamID;

        const metrics = toVisitMetrics(Player, risk);
        let cancelled = false;
        (async () => {
            const last = await getLastSnapshot(steamID);
            if (!cancelled) {
                setDeltaInfo(
                    last
                        ? {
                              lastTs: last.ts,
                              deltas: computeDeltas(last.metrics, metrics),
                          }
                        : { lastTs: null, deltas: [] },
                );
            }
            await saveSnapshot(steamID, metrics);
        })();
        return () => {
            cancelled = true;
        };
    }, [ready, Player.steamID]);

    if (!ready) {
        return (
            <span className={css.risk_badge_wrap}>
                <span
                    className={classNames(css.risk_badge, css.severity_unknown)}
                >
                    Risk: …
                </span>
            </span>
        );
    }

    const severity = riskSeverity(risk.level);

    /* Position the popover just under the badge when it opens. */
    const positionPopover = (event: React.ToggleEvent<HTMLDivElement>) => {
        if (event.newState !== "open") return;
        const trigger = triggerRef.current;
        const popover = popoverRef.current;
        if (!trigger || !popover) return;

        const rect = trigger.getBoundingClientRect();
        const maxLeft = window.innerWidth - popover.offsetWidth - 8;
        popover.style.top = `${rect.bottom + 6}px`;
        popover.style.left = `${Math.max(8, Math.min(rect.left, maxLeft))}px`;
    };

    return (
        <span className={css.risk_badge_wrap}>
            <button
                type="button"
                ref={triggerRef}
                popoverTarget={POPOVER_ID}
                className={classNames(css.risk_badge, {
                    [css.severity_red]: severity === "danger",
                    [css.severity_amber]: severity === "warning",
                    [css.severity_green]: severity === "normal",
                })}
            >
                {LEVEL_LABEL[risk.level]}
                {!risk.clean ? ` · ${risk.score}` : ""}
            </button>

            <div
                id={POPOVER_ID}
                ref={popoverRef}
                popover="auto"
                className={css.risk_popover}
                onToggle={positionPopover}
            >
                <div className={css.risk_popover_header}>
                    <span
                        className={classNames(css.risk_badge, {
                            [css.severity_red]: severity === "danger",
                            [css.severity_amber]: severity === "warning",
                            [css.severity_green]: severity === "normal",
                        })}
                    >
                        {LEVEL_LABEL[risk.level]}
                        {!risk.clean ? ` · ${risk.score}` : ""}
                    </span>
                </div>

                <p className={css.risk_popover_note}>
                    A weighted tally of anticheat hits, player reports and Steam
                    profile flags. Watch at {config.thresholds.watch}+, High
                    risk at {config.thresholds.high}+.
                </p>

                {risk.clean ? (
                    <p className={css.risk_popover_empty}>
                        No risk signals detected.
                    </p>
                ) : (
                    <ul className={css.risk_factors}>
                        {risk.factors.map((factor) => (
                            <li key={factor.label}>
                                <span>{factor.label}</span>
                                <span className={css.risk_factor_points}>
                                    +{fmtPoints(factor.points)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {deltaInfo && (
                    <div className={css.risk_deltas}>
                        {deltaInfo.lastTs === null ? (
                            <span className={css.risk_deltas_title}>
                                First time viewing this player.
                            </span>
                        ) : (
                            <>
                                <span className={css.risk_deltas_title}>
                                    Since last visit (
                                    {fromNow(deltaInfo.lastTs)}
                                    ):
                                </span>
                                {deltaInfo.deltas.length === 0 ? (
                                    <span className={css.risk_deltas_none}>
                                        No changes.
                                    </span>
                                ) : (
                                    <ul className={css.risk_factors}>
                                        {deltaInfo.deltas.map((entry) => (
                                            <li key={entry.key}>
                                                <span>{entry.label}</span>
                                                <span
                                                    className={
                                                        entry.delta > 0
                                                            ? css.delta_up
                                                            : css.delta_down
                                                    }
                                                >
                                                    {entry.delta > 0 ? "+" : ""}
                                                    {fmtPoints(entry.delta)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </span>
    );
}
