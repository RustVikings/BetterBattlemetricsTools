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

/**
 * Format a date as a short locale string, e.g. "Feb 26, 2026".
 * Equivalent to moment's "MMM DD, YYYY" format.
 *
 * @param date - Date object, ISO string, or timestamp in milliseconds.
 */
export function formatShortDate(date: Date | string | number): string {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

/**
 * Format a date as a long locale string, e.g. "Friday, February 26, 2026 at 12:00 PM".
 * Equivalent to moment's "LLLL" format.
 *
 * @param date - Date object, ISO string, or timestamp in milliseconds.
 */
export function formatLongDate(date: Date | string | number): string {
    return new Date(date).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

/**
 * Format a date as "Weekday, HH:mm:ss" in 24-hour time,
 * e.g. "Wednesday, 14:30:25".
 * Equivalent to moment's "dddd, HH:mm:ss" format.
 *
 * @param date - Date object, ISO string, or timestamp in milliseconds.
 */
export function formatDayTime(date: Date | string | number): string {
    return new Date(date).toLocaleString("en-US", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}

/**
 * Return a human-readable relative time string, e.g. "3 years ago".
 * Equivalent to moment's fromNow() / fromNow(true).
 *
 * @param date - Date object, ISO string, or timestamp in milliseconds.
 * @param withoutSuffix - If true, omit " ago" (e.g. "3 years" instead of "3 years ago").
 */
export function fromNow(
    date: Date | string | number,
    withoutSuffix = false,
): string {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);

    let result: string;
    if (diffYear >= 1) result = `${diffYear} year${diffYear > 1 ? "s" : ""}`;
    else if (diffMonth >= 1)
        result = `${diffMonth} month${diffMonth > 1 ? "s" : ""}`;
    else if (diffDay >= 1) result = `${diffDay} day${diffDay > 1 ? "s" : ""}`;
    else if (diffHour >= 1)
        result = `${diffHour} hour${diffHour > 1 ? "s" : ""}`;
    else if (diffMin >= 1)
        result = `${diffMin} minute${diffMin > 1 ? "s" : ""}`;
    else result = "a few seconds";

    return withoutSuffix ? result : `${result} ago`;
}
