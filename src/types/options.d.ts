/**
 * Types for Own Servers configuration
 */
export type OwnServerType = {
    id: string;
    ip: string;
    name: string;
    port: number;
};

/**
 * Types for Own Server with checked state
 */
export type OwnServer = {
    checked?: boolean;
    server: OwnServerType;
};

export type Options = {
    arkan?: boolean;
    battlemetricsApiToken: string;
    battlemetricsApiTokenIsValid?: boolean;
    guardian?: boolean;
    ownServers: OwnServer[];
    refreshingServers?: boolean;
    rustAdmin?: boolean;
    rustStats?: boolean;
    saveButtonText?: string;
    saveEnabled?: boolean;
    serverArmour?: boolean;
    steamApiKey: string;
    steamApiKeyIsValid?: boolean;
};
