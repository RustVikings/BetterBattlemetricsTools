import React, { JSX, ChangeEvent, FocusEvent, useState } from "react";
import { TextInput } from "./components/textinput";
import { Switch } from "./components/switch";
import css from "./styles.module.css";

interface OptionsProps {
    arkanLink?: boolean;
    battleMetricsApiToken?: string;
    battlemetricsApiTokenIsValid?: boolean | undefined;
    guardianLink?: boolean;
    rustAdminLink?: boolean;
    rustStatsLink?: boolean;
    serverArmourLink?: boolean;
    steamApiKey?: string;
    steamApiKeyIsValid?: boolean | undefined;
}

export function Options(props: OptionsProps): JSX.Element {
    const handleValidation = (type: string, value: string): boolean => {
        if (type === "steamApiKey") {
            const regex = /[\dA-Z]{32}/g;
            if (value.match(regex) !== null) {
                // console.log("STEAM OK");
                return true;
            } else {
                // console.log("STEAM NOT OK");
                return false;
            }
        }
        if (type === "battleMetricsApiToken") {
            const regex = /[\dA-Za-z._-]{240,247}/g;
            if (value.match(regex) !== null) {
                // console.log("BM OK");
                return true;
            } else {
                // console.log("BM NOT OK");
                return false;
            }
        }
        return false;
    };

    /* const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault;
        console.log(e);
    }; */

    function initForm(): OptionsProps {
        return {
            arkanLink: true,
            battleMetricsApiToken: "",
            guardianLink: false,
            rustAdminLink: false,
            rustStatsLink: false,
            serverArmourLink: false,
            steamApiKey: "",
        };
    }

    const [form, setForm] = useState(initForm);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(() => ({
            ...form,
            [name]: value,
            [name + "IsValid"]: handleValidation(name, value),
        }));
        console.log("===== onChange =====", form);
    };

    const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(() => ({
            ...form,
            [name]: value,
            [name + "IsValid"]: handleValidation(name, value),
        }));
        console.log("===== onBlur =====", form);
    };

    return (
        <div className={css.options_form}>
            <h1>Advanced Battlemetrics Tools</h1>
            <form>
                <fieldset>
                    <TextInput
                        errorMessage="Please insert a valid Battlemetrics API Token"
                        inputIsValid={
                            form.battlemetricsApiTokenIsValid || undefined
                        }
                        href="https://www.battlemetrics.com/developers/token"
                        label="Battlemetrics API Token"
                        name="battleMetricsApiToken"
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                        permissions="Required permissions: Actvity Log, View, search, and list bans, View RCON information"
                        placeholder="Battlemetrics API Token"
                        value={form.battleMetricsApiToken}
                    />
                    <TextInput
                        errorMessage="Please insert a valid Steam API Key"
                        inputIsValid={form.steamApiKeyIsValid || undefined}
                        href="https://steamcommunity.com/dev/apikey"
                        label="Steam API Key"
                        name="steamApiKey"
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                        placeholder="Steam API Key"
                        value={form.steamApiKey}
                    />
                </fieldset>
                <fieldset>
                    <Switch
                        name="arkanLink"
                        label="Arkan violations"
                        onChange={handleOnChange}
                        href="https://umod.org/plugins/arkan"
                        checked={form.arkanLink}
                    />
                    <Switch
                        name="guardianLink"
                        label="Guardian violations"
                        onChange={handleOnChange}
                        href="https://umod.org/plugins/guardian"
                        checked={form.guardianLink}
                    />
                    <Switch
                        name="rustAdminLink"
                        label="RustAdmin shared bans"
                        onChange={handleOnChange}
                        href="https://www.rustadmin.com/"
                        checked={form.rustAdminLink}
                    />
                    <Switch
                        name="serverArmourLink"
                        label="Server Armour"
                        onChange={handleOnChange}
                        href="https://serverarmour.com/home"
                        checked={form.serverArmourLink}
                    />
                    <Switch
                        name="rustStatsLink"
                        label="ruststats.io"
                        onChange={handleOnChange}
                        href="https://ruststats.io/"
                        checked={props.rustStatsLink}
                    />
                </fieldset>
                <button>Save settings</button>
            </form>
        </div>
    );
}

export default Options;
