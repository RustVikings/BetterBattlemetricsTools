import Browser from "webextension-polyfill";
import { Player } from "@src/types";
import { RiskResult } from "./risk";

/**
 * Per-player visit history.
 *
 * On each visit we snapshot a small set of risk-relevant metrics, keyed by
 * steamID, into a dedicated `storage.local` key (kept separate from the flat
 * options object). On the next visit we diff the current metrics against the
 * stored snapshot to surface what changed since an admin last looked — a player
 * who was clean last time but has since racked up violations jumps out.
 *
 * Everything is client-side; storage.local is per-browser and unsynced, so this
 * is per-admin history rather than a shared team log.
 */

const STORAGE_KEY = "brt_visits";
/** Cap stored players so history can't grow unbounded. */
const MAX_ENTRIES = 500;

export interface VisitMetrics {
    riskScore: number;
    arkanNoRecoil: number;
    arkanAimbot: number;
    guardianCheat: number;
    guardianAntiflood: number;
    reportsCheat: number;
    reportsTeaming: number;
    reportsOther: number;
}

export interface VisitSnapshot {
    ts: number;
    metrics: VisitMetrics;
}

type VisitStore = Record<string, VisitSnapshot>;

/** Human-readable labels for each tracked metric, in display order. */
const METRIC_LABELS: Record<keyof VisitMetrics, string> = {
    riskScore: "Risk score",
    arkanAimbot: "Arkan aimbot",
    arkanNoRecoil: "Arkan no-recoil",
    guardianCheat: "Guardian cheat",
    guardianAntiflood: "Guardian anti-flood",
    reportsCheat: "Cheating reports",
    reportsTeaming: "Teaming reports",
    reportsOther: "Other reports",
};

/** Build the snapshot metrics from the loaded player and its computed risk. */
export function toVisitMetrics(player: Player, risk: RiskResult): VisitMetrics {
    const { anticheat, reports } = player.stats;
    return {
        riskScore: risk.score,
        arkanNoRecoil: anticheat.arkan.no_recoil,
        arkanAimbot: anticheat.arkan.aimbot,
        guardianCheat: anticheat.guardian.cheat,
        guardianAntiflood: anticheat.guardian.antiflood,
        reportsCheat: reports.cheat,
        reportsTeaming: reports.teaming,
        reportsOther: reports.other,
    };
}

async function readStore(): Promise<VisitStore> {
    const result = await Browser.storage.local.get(STORAGE_KEY);
    return (result?.[STORAGE_KEY] as VisitStore) ?? {};
}

/** The most recent snapshot for a player, or undefined if never seen. */
export async function getLastSnapshot(
    steamID: string,
): Promise<VisitSnapshot | undefined> {
    if (!steamID) return undefined;
    const store = await readStore();
    return store[steamID];
}

/** Record a snapshot for a player, pruning oldest entries past the cap. */
export async function saveSnapshot(
    steamID: string,
    metrics: VisitMetrics,
): Promise<void> {
    if (!steamID) return;

    const store = await readStore();
    store[steamID] = { ts: Date.now(), metrics };

    const keys = Object.keys(store);
    if (keys.length > MAX_ENTRIES) {
        const stale = keys
            .sort((a, b) => store[b].ts - store[a].ts)
            .slice(MAX_ENTRIES);
        for (const key of stale) delete store[key];
    }

    await Browser.storage.local.set({ [STORAGE_KEY]: store });
}

export interface MetricDelta {
    key: keyof VisitMetrics;
    label: string;
    delta: number;
}

/** Non-zero metric changes between two snapshots, in display order. */
export function computeDeltas(
    previous: VisitMetrics,
    current: VisitMetrics,
): MetricDelta[] {
    return (Object.keys(METRIC_LABELS) as (keyof VisitMetrics)[])
        .map((key) => ({
            key,
            label: METRIC_LABELS[key],
            delta: current[key] - previous[key],
        }))
        .filter((entry) => entry.delta !== 0);
}
