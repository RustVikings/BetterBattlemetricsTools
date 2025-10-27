export type SteamAppId = number;

export type PersonaStateTypes =
    | 0 /* Offline */
    | 1 /* Online */
    | 2 /* Busy */
    | 3 /* Away */
    | 4 /* Snooze */
    | 5 /* Looking to Trade */
    | 6 /* Looking to Play */;

export type ProfileStateTypes = 1 | undefined;

export type CommunityVisibilityStateTypes = 1 /* Private */ | 3 /* Public */;

export type SteamPlayerProfile = {
    steamid: string;
    communityvisibilitystate: CommunityVisibilityStateTypes;
    profilestate: ProfileStateTypes;
    personaname: string;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    avatarhash: string;
    lastlogoff: number;
    personastate: PersonaStateTypes;
    timecreated: number;
};
