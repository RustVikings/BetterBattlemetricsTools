export function isWithin24hours(date: string): boolean {
    const now = Math.round(new Date().getTime() / 1000);
    const timeStampYesterday = now - 24 * 3600;
    return new Date(date).getTime() >= timeStampYesterday * 1000;
}

// export function isWithin24hours(date) {
//     const timeStamp = Math.round(new Date().getTime() / 1000);
//     const timeStampYesterday = timeStamp - 24 * 3600;
//     return date >= new Date(timeStampYesterday * 1000).getTime();
// }

export function secondsToHours(seconds: number): number {
    return Math.round(seconds / 3600);
}

export function minutesToHours(minutes: number): number {
    return Math.round(minutes / 60);
}
