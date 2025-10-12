import React, { JSX } from "react";
import { Switch } from "../switch";
import css from "./styles.module.css";

export function Servers(servers: any): JSX.Element {
    const list = servers.props.servers.map((server: any) => {
        return (
            <Switch
                key={server.id}
                name={server.id}
                showLink={false}
                label={server.attributes.name}
                checked
            />
        );
    });

    console.log(servers.props.servers);

    return (
        <fieldset className={css.last}>
            <legend>Servers</legend>
            {list}
        </fieldset>
    );
}

{
    /* <Switch
    showLink={true}
    name="rustStatsLink"
    label="ruststats.io"
    onChange={handleOnChange}
    href="https://ruststats.io/"
    checked={formData.rustStatsLink}
/>; */
}
