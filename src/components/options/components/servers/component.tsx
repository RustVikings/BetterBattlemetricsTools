import React, { JSX, InputHTMLAttributes } from "react";
import { Switch } from "../switch";
import { Spinner } from "../spinner";
import css from "../../styles.module.css";
import classNames from "classnames";

interface OrgServer {
    checked: boolean;
    server: Record<string, unknown>;
}

interface ServersProps {
    serverList?: OrgServer[];
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    refreshingServers?: boolean;
}

export function Servers(props: ServersProps): JSX.Element {
    let list: JSX.Element[] | undefined;

    if (props.serverList) {
        list = props.serverList.map((entry: OrgServer, i) => {
            return (
                <Switch
                    key={i}
                    name={"s" + i}
                    id={"s" + i}
                    showLink={false}
                    label={String(entry.server.name)}
                    checked={entry.checked}
                    onChange={props.onChange}
                />
            );
        });
    }

    return props.serverList && props.serverList.length > 0 ? (
        <fieldset className={css.server_list}>
            <legend>
                <span>Servers</span>
                <button
                    type="button"
                    className={classNames(css.button, css.refresh)}
                    onClick={props.onClick}
                >
                    <img
                        src="./icons/refresh.svg"
                        title="Refresh servers"
                        alt="Refresh server"
                        className={
                            props.refreshingServers ? "animate-spin" : ""
                        }
                    />
                </button>
            </legend>
            {list}
        </fieldset>
    ) : (
        <fieldset className={css.last}>
            <legend>
                <span>Servers</span>
            </legend>
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
