/**
 * Utility functions for time-related operations.
 */

/**
 * Check if a date is within the last 24 hours.
 * @param date
 * @returns true if date is within the last 24 hours, false otherwise
 */
export function isWithin24hours(date: string): boolean {
    const now = Math.round(new Date().getTime() / 1000);
    const timeStampYesterday = now - 24 * 3600;
    return new Date(date).getTime() >= timeStampYesterday * 1000;
}

/**
 * Convert seconds to hours.
 *
 * @param seconds - The number of seconds.
 * @returns The number of hours.
 *
 * Steam API returns playtime in seconds.
 */
export function secondsToHours(seconds: number): number {
    return Math.round(seconds / 3600);
}

/**
 * Convert minutes to hours.
 *
 * @param minutes - The number of minutes.
 * @returns The number of hours.
 *
 * BattleMetrics APIs return playtime in minutes.
 */
export function minutesToHours(minutes: number): number {
    return Math.round(minutes / 60);
}
