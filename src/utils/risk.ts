import { Player } from "@src/types";

/**
 * Risk scoring
 *
 * Turns the signals the extension already fetches (Arkan/Guardian anticheat
 * hits, player reports, playtime and Steam profile state) into a single,
 * transparent "sus" score for fast triage.
 *
 * Design goals:
 *  - Pure & client-side: no network calls, deterministic from the Player object.
 *  - Auditable: every point that lands in the score is returned as a labelled
 *    factor so the UI can show *why* a player scored the way they did. Admins
 *    won't trust a black box.
 *  - Public-safe: no assumptions about specific servers or communities.
 *
 * The weights below are intentionally exported so they can be surfaced in the
 * options page and tuned later without touching the scoring logic.
 */

/** Point weights applied per signal. Tune here. */
export const RISK_WEIGHTS = {
    /* Anticheat hits are the strongest cheat signals. */
    arkanAimbot: 4, // per [Arkan] AIMBOT probable violation
    arkanNoRecoil: 3, // per [Arkan] No Recoil probable violation
    guardianCheat: 3, // per Guardian AntiCheat detection
    guardianAntiflood: 0.5, // per Guardian AntiFlood detection (low signal)
    /* Community reports are softer signals — many are noise. */
    reportCheat: 1.5, // per cheating report
    reportTeamingOrOther: 0.5, // per teaming / other report
    /* Steam profile heuristics. */
    privateProfile: 3, // profile not public (hides bans/hours)
    accountVeryNew: 5, // Steam account younger than VERY_NEW_DAYS
    accountNew: 2, // Steam account younger than NEW_DAYS
    /* Rate-based flag: heavy cheat-report rate relative to playtime. */
    highCheatReportRate: 4,
} as const;

/** Per-signal contribution caps, so a single noisy signal can't dominate. */
export const RISK_CAPS = {
    arkanAimbot: 20,
    arkanNoRecoil: 15,
    guardianCheat: 15,
    guardianAntiflood: 4,
    reportCheat: 12,
    reportTeamingOrOther: 4,
} as const;

/** Score thresholds. */
export const RISK_THRESHOLDS = {
    high: 20,
    watch: 8,
} as const;

export type RiskWeightKey = keyof typeof RISK_WEIGHTS;
export type RiskWeights = Record<RiskWeightKey, number>;
export interface RiskThresholds {
    high: number;
    watch: number;
}

/**
 * Admin-tunable risk configuration. Persisted (partially) in the options page
 * and merged onto the defaults at read time via {@link resolveRiskConfig}.
 */
export interface RiskConfig {
    weights: RiskWeights;
    thresholds: RiskThresholds;
}

export const DEFAULT_RISK_CONFIG: RiskConfig = {
    weights: { ...RISK_WEIGHTS },
    thresholds: { ...RISK_THRESHOLDS },
};

/**
 * Merge a stored (possibly partial or stale) config onto the current defaults,
 * so missing/added keys always resolve to a sensible number.
 */
export function resolveRiskConfig(partial?: Partial<RiskConfig>): RiskConfig {
    return {
        weights: { ...DEFAULT_RISK_CONFIG.weights, ...partial?.weights },
        thresholds: {
            ...DEFAULT_RISK_CONFIG.thresholds,
            ...partial?.thresholds,
        },
    };
}

/** Steam account-age thresholds, in days. */
const VERY_NEW_DAYS = 30;
const NEW_DAYS = 90;

/** Cheat-reports-per-100h above which the rate flag fires. */
const HIGH_CHEAT_REPORT_RATE_PER_100H = 5;

export type RiskLevel = "low" | "watch" | "high";

/** A single labelled contribution to the score, for a transparent breakdown. */
export interface RiskFactor {
    label: string;
    points: number;
}

export interface RiskResult {
    level: RiskLevel;
    score: number;
    /** Non-empty contributions, largest first. */
    factors: RiskFactor[];
    /** True when there were no positive signals at all. */
    clean: boolean;
}

/** Severity token used by the existing DataPoint / tag styles. */
export function riskSeverity(
    level: RiskLevel,
): "normal" | "warning" | "danger" {
    switch (level) {
        case "high":
            return "danger";
        case "watch":
            return "warning";
        default:
            return "normal";
    }
}

function capped(count: number, weight: number, cap: number): number {
    return Math.min(count * weight, cap);
}

/** Days since a unix (seconds) timestamp, or undefined if not available. */
function daysSince(unixSeconds?: number): number | undefined {
    if (!unixSeconds) return undefined;
    const ms = Date.now() - unixSeconds * 1000;
    return ms / (1000 * 60 * 60 * 24);
}

/**
 * Compute a player's risk score from the data already loaded into the Player
 * object. Callers should only render the result once the underlying stats have
 * finished loading, since missing data reads as zero (i.e. "clean").
 */
export function computeRisk(
    player: Player,
    config: RiskConfig = DEFAULT_RISK_CONFIG,
): RiskResult {
    const { weights, thresholds } = config;
    const { anticheat, reports, playtime } = player.stats;
    const steam = player.profile.steam;

    const factors: RiskFactor[] = [];
    const add = (label: string, points: number) => {
        if (points > 0) factors.push({ label, points });
    };

    add(
        "Arkan aimbot hits",
        capped(
            anticheat.arkan.aimbot,
            weights.arkanAimbot,
            RISK_CAPS.arkanAimbot,
        ),
    );
    add(
        "Arkan no-recoil hits",
        capped(
            anticheat.arkan.no_recoil,
            weights.arkanNoRecoil,
            RISK_CAPS.arkanNoRecoil,
        ),
    );
    add(
        "Guardian cheat hits",
        capped(
            anticheat.guardian.cheat,
            weights.guardianCheat,
            RISK_CAPS.guardianCheat,
        ),
    );
    add(
        "Guardian anti-flood hits",
        capped(
            anticheat.guardian.antiflood,
            weights.guardianAntiflood,
            RISK_CAPS.guardianAntiflood,
        ),
    );
    add(
        "Cheating reports",
        capped(reports.cheat, weights.reportCheat, RISK_CAPS.reportCheat),
    );
    add(
        "Teaming / other reports",
        capped(
            reports.teaming + reports.other,
            weights.reportTeamingOrOther,
            RISK_CAPS.reportTeamingOrOther,
        ),
    );

    /* Cheat-report rate relative to tracked playtime. */
    const hours = playtime.battlemetrics;
    if (hours > 0 && reports.cheat > 0) {
        const ratePer100h = (reports.cheat / hours) * 100;
        if (ratePer100h >= HIGH_CHEAT_REPORT_RATE_PER_100H) {
            add(
                `High cheat-report rate (${ratePer100h.toFixed(1)}/100h)`,
                weights.highCheatReportRate,
            );
        }
    }

    /* Steam profile heuristics. */
    if (
        steam?.communityvisibilitystate !== undefined &&
        steam.communityvisibilitystate !== 3
    ) {
        add("Private Steam profile", weights.privateProfile);
    }
    const ageDays = daysSince(steam?.timecreated);
    if (ageDays !== undefined) {
        if (ageDays < VERY_NEW_DAYS) {
            add(
                `New Steam account (<${VERY_NEW_DAYS}d)`,
                weights.accountVeryNew,
            );
        } else if (ageDays < NEW_DAYS) {
            add(`Young Steam account (<${NEW_DAYS}d)`, weights.accountNew);
        }
    }

    factors.sort((a, b) => b.points - a.points);
    const score = factors.reduce((sum, f) => sum + f.points, 0);

    let level: RiskLevel = "low";
    if (score >= thresholds.high) level = "high";
    else if (score >= thresholds.watch) level = "watch";

    return {
        level,
        score: Math.round(score * 10) / 10,
        factors,
        clean: factors.length === 0,
    };
}
