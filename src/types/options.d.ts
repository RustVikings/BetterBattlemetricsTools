export type OwnServerType = {
    id: string;
    ip: string;
    name: string;
    port: number;
};

export type OwnServer = {
    checked?: boolean;
    server: OwnServerType;
};
