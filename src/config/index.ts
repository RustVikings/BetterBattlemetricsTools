/**
 * Static values for Extension configuration
 */
import { SteamAppId } from "@src/types";

/** The Steam App ID for Rust */
export const RUST_APP_ID: SteamAppId = 252490;

/** Interval for refreshing player activity data from Battlemetrics API */
export const REFRESH_PLAYER_ACTIVITY_INTERVAL_MS: number = 1 * 60 * 1000; // 1 minute
