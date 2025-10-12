import React, { JSX, InputHTMLAttributes } from "react";
import { Switch } from "../switch";
import { Spinner } from "../spinner";
import css from "../../styles.module.css";

interface OrgServer {
    checked: boolean;
    server: Record<string, unknown>;
}

interface ServersProps extends InputHTMLAttributes<HTMLInputElement> {
    serverList?: OrgServer[];
}

export function Servers(props: ServersProps): JSX.Element {
    let list: any;

    if (props.serverList) {
        list = props.serverList.map((entry: any, i) => {
            return (
                <Switch
                    key={i}
                    name={"s" + i}
                    id={"s" + i}
                    showLink={false}
                    label={entry.server.name}
                    checked={entry.checked}
                    onChange={props.onChange}
                />
            );
        });
    }

    return props.serverList && props.serverList.length > 0 ? (
        <fieldset className={css.last}>
            <legend>Servers</legend>
            {list}
        </fieldset>
    ) : (
        <fieldset className={css.last}>
            <legend>Servers</legend>
            <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400"
                role="alert"
            >
                <span className="font-bold">Error:</span> Could not retrieve
                your servers. Check your Battlemetrics API token.
            </div>
        </fieldset>
    );
}
