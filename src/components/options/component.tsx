import React, {
    JSX,
    ChangeEvent,
    FocusEvent,
    useState,
    useEffect,
} from "react";
import { TextInput } from "./components/textinput";
import { Switch } from "./components/switch";
import { Servers } from "./components/servers";
// import { Spinner } from "./components/spinner";
import css from "./styles.module.css";
import Browser = require("webextension-polyfill");
import { getServers } from "../../messaging/battlemetrics/getServers";

/* let SETTINGS: OptionsProps;
Browser.storage.sync.get().then((response) => {
    SETTINGS = response;
}); */

interface OptionsProps {
    arkanLink?: boolean | undefined;
    battlemetricsApiToken: string;
    battlemetricsApiTokenIsValid?: boolean | undefined;
    guardianLink?: boolean | undefined;
    rustAdminLink?: boolean | undefined;
    rustStatsLink?: boolean | undefined;
    serverArmourLink?: boolean | undefined;
    steamApiKey: string;
    steamApiKeyIsValid?: boolean | undefined;
    saveEnabled?: boolean;
    orgServers?: Record<string, unknown> | [];
}

export function Options(): JSX.Element {
    const initializeForm = (): OptionsProps => {
        return {
            arkanLink: true,
            battlemetricsApiToken: "",
            guardianLink: true,
            rustAdminLink: true,
            rustStatsLink: true,
            serverArmourLink: true,
            steamApiKey: "",
            saveEnabled: false,
        };
    };

    const [formData, setFormData] = useState(initializeForm);

    const handleApiKeyValidation = (type: string, value: string): boolean => {
        if (type === "steamApiKey") {
            const regex = /[\dA-Z]{32}/g;
            if (value.match(regex) !== null) {
                return true;
            } else {
                return false;
            }
        }
        if (type === "battlemetricsApiToken") {
            const regex = /[\dA-Za-z._-]{240,247}/g;
            if (value.match(regex) !== null) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    };

    const handleSaveButtonState = () => {
        // console.log("save button", formData);
        if (
            formData.battlemetricsApiTokenIsValid === true &&
            formData.steamApiKeyIsValid === true
        ) {
            return true;
        }
        return false;
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (type === "text") {
            const validationResult = handleApiKeyValidation(name, value);
            const validationProp = name + "IsValid";
            const saveButtonState = handleSaveButtonState();
            setFormData(() => ({
                ...formData,
                [name]: value,
                [validationProp]: validationResult,
                saveEnabled: saveButtonState,
            }));
            if (formData.battlemetricsApiTokenIsValid) {
                getMyServers();
            }
        } else {
            setFormData(() => ({ ...formData, [name]: checked }));
        }
    };

    const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value, type, checked, id } = e.target;
        if (type === "text") {
            const validationResult = handleApiKeyValidation(name, value);
            const validationProp = name + "IsValid";
            const saveButtonState = handleSaveButtonState();
            setFormData(() => ({
                ...formData,
                [name]: value,
                [validationProp]: validationResult,
                saveEnabled: saveButtonState,
            }));
        }
        if (type === "checkbox") {
            setFormData(() => ({ ...formData, [name]: checked }));
        }
        if (formData.battlemetricsApiTokenIsValid) {
            getMyServers();
        }
    };

    const handleSave = () => {
        Browser.storage.sync
            .set({ ...formData })
            .then(() => {
                // console.log("save ok");
            })
            .catch(() => {
                // console.log("save error");
            });
    };

    const getMyServers = () => {
        if (
            formData.battlemetricsApiTokenIsValid === true &&
            formData.battlemetricsApiToken !== ""
        ) {
            getServers({
                key: formData.battlemetricsApiToken,
            }).then((response) => {
                setFormData({ ...formData, orgServers: response.serverList });
            });
        }
        return false;
    };

    useEffect(() => {
        console.log("useEffect", formData);
    }, [
        formData.battlemetricsApiToken,
        formData.battlemetricsApiTokenIsValid,
        formData.steamApiKey,
        formData.steamApiKeyIsValid,
    ]);

    console.log("render", formData);

    return (
        <div className={css.options_form}>
            <form>
                <fieldset>
                    <TextInput
                        errorMessage="Please insert a valid Battlemetrics API Token"
                        href="https://www.battlemetrics.com/developers/token"
                        inputIsValid={
                            formData.battlemetricsApiTokenIsValid || undefined
                        }
                        label="Battlemetrics API Token"
                        name="battlemetricsApiToken"
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                        permissions="Required permissions: Actvity Log, View, search, and list bans, View RCON information"
                        placeholder="Battlemetrics API Token"
                        value={formData.battlemetricsApiToken}
                    />
                    <TextInput
                        errorMessage="Please insert a valid Steam API Key"
                        href="https://steamcommunity.com/dev/apikey"
                        inputIsValid={formData.steamApiKeyIsValid || undefined}
                        label="Steam API Key"
                        name="steamApiKey"
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                        placeholder="Steam API Key"
                        value={formData.steamApiKey}
                    />
                </fieldset>
                <fieldset>
                    <legend>Links</legend>
                    <Switch
                        showLink={true}
                        name="arkanLink"
                        label="Arkan violations"
                        onChange={handleOnChange}
                        href="https://umod.org/plugins/arkan"
                        checked={formData.arkanLink}
                    />
                    <Switch
                        showLink={true}
                        name="guardianLink"
                        label="Guardian violations"
                        onChange={handleOnChange}
                        href="https://umod.org/plugins/guardian"
                        checked={formData.guardianLink}
                    />
                    <Switch
                        showLink={true}
                        name="rustAdminLink"
                        label="RustAdmin shared bans"
                        onChange={handleOnChange}
                        href="https://www.rustadmin.com/"
                        checked={formData.rustAdminLink}
                    />
                    <Switch
                        showLink={true}
                        name="serverArmourLink"
                        label="Server Armour"
                        onChange={handleOnChange}
                        href="https://serverarmour.com/home"
                        checked={formData.serverArmourLink}
                    />
                    <Switch
                        showLink={true}
                        name="rustStatsLink"
                        label="ruststats.io"
                        onChange={handleOnChange}
                        href="https://ruststats.io/"
                        checked={formData.rustStatsLink}
                    />
                </fieldset>
                {/* render server list when available */}
                {formData.orgServers ? (
                    <Servers props={formData.orgServers} />
                ) : (
                    ""
                )}
                <button
                    type="button"
                    disabled={!formData.saveEnabled}
                    onClick={handleSave}
                >
                    {formData.saveEnabled ? "Save settings" : "Save settings"}
                </button>
            </form>
        </div>
    );
}
