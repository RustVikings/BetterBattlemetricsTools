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
import { Spinner } from "./components/spinner";
import css from "./styles.module.css";
import Browser = require("webextension-polyfill");
import { getServers } from "../../messaging/battlemetrics/getServers";
import { getOptions } from "../../messaging/internal/getOptions";
import version from "../../manifest.json";

export interface OrgServer {
    checked: boolean;
    server: Record<string, unknown>;
}

export interface OptionsProps {
    arkanLink: boolean;
    battlemetricsApiToken: string;
    battlemetricsApiTokenIsValid?: boolean;
    guardianLink: boolean;
    rustAdminLink: boolean;
    rustStatsLink: boolean;
    serverArmourLink: boolean;
    steamApiKey: string;
    steamApiKeyIsValid?: boolean;
    saveEnabled?: boolean;
    orgServers: OrgServer[];
    refreshingServers?: boolean;
    saveButtonText?: string;
}

export function Options(): JSX.Element {
    const defaultOptions: OptionsProps = {
        arkanLink: true,
        battlemetricsApiToken: "",
        guardianLink: true,
        rustAdminLink: true,
        rustStatsLink: true,
        serverArmourLink: true,
        steamApiKey: "",
        saveEnabled: false,
        orgServers: [],
        saveButtonText: "Save options",
        refreshingServers: false,
    };

    const [formData, setFormData] = useState<OptionsProps>(defaultOptions);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const response = await getOptions({});
                const options = response.Options;
                if (options) {
                    setFormData({
                        arkanLink:
                            typeof options?.arkanLink === "boolean"
                                ? options.arkanLink
                                : true,
                        battlemetricsApiToken:
                            typeof options?.battlemetricsApiToken === "string"
                                ? options.battlemetricsApiToken
                                : "",
                        battlemetricsApiTokenIsValid:
                            typeof options?.battlemetricsApiToken ===
                                "string" &&
                            options.battlemetricsApiToken.length > 0
                                ? true
                                : false,
                        guardianLink:
                            typeof options?.guardianLink === "boolean"
                                ? options.guardianLink
                                : true,
                        rustAdminLink:
                            typeof options?.rustAdminLink === "boolean"
                                ? options.rustAdminLink
                                : true,
                        rustStatsLink:
                            typeof options?.rustStatsLink === "boolean"
                                ? options.rustStatsLink
                                : true,
                        serverArmourLink:
                            typeof options?.serverArmourLink === "boolean"
                                ? options.serverArmourLink
                                : true,
                        steamApiKey:
                            typeof options?.steamApiKey === "string"
                                ? options.steamApiKey
                                : "",
                        steamApiKeyIsValid:
                            typeof options?.steamApiKey === "string" &&
                            options.steamApiKey.length > 0
                                ? true
                                : false,
                        saveEnabled: false,
                        orgServers: Array.isArray(options?.orgServers)
                            ? options.orgServers
                            : [],
                        saveButtonText: "Options loaded",
                        refreshingServers: false,
                    });
                }
            } catch (e) {
                // fallback to defaultOptions
                setFormData(defaultOptions);
            }
        }
        fetchOptions();
    }, []);

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

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (type === "text" || type === "password") {
            const validationResult = handleApiKeyValidation(name, value);
            const validationProp = name + "IsValid";
            if (name === "steamApiKey") {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                    [validationProp]: validationResult,
                    saveButtonText: "Save options",
                }));
            } else {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: checked,
                saveButtonText: "Save options",
            }));
        }
    };

    const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value, type, checked, id } = e.target;
        if (type === "text") {
            const validationResult = handleApiKeyValidation(name, value);
            const validationProp = name + "IsValid";
            if (name === "steamApiKey") {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                    [validationProp]: validationResult,
                    saveButtonText: "Save options",
                }));
            } else {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                    saveButtonText: "Save options",
                }));
            }
        }
        if (type === "checkbox") {
            setFormData((prevState) => ({
                ...prevState,
                [name]: checked,
                saveButtonText: "Save options",
            }));
        }
    };

    useEffect(() => {
        if (
            handleApiKeyValidation(
                "battlemetricsApiToken",
                formData.battlemetricsApiToken,
            ) &&
            formData.orgServers.length === 0
        ) {
            getMyServers();
        }
    }, [formData.battlemetricsApiToken]);

    useEffect(() => {
        if (handleApiKeyValidation("steamApiKey", formData.steamApiKey)) {
            setFormData((prevState) => ({
                ...prevState,
                steamApiKeyIsValid: true,
            }));
        }
    }, [formData.steamApiKey]);

    // console.log("render:formData", formData);

    useEffect(() => {
        if (
            formData.battlemetricsApiTokenIsValid &&
            formData.steamApiKeyIsValid
        ) {
            const newState = { ...formData };
            newState["saveEnabled"] = true;
            setFormData(newState);
        } else {
            const newState = { ...formData };
            newState["saveEnabled"] = false;
            setFormData(newState);
        }
    }, [formData.battlemetricsApiTokenIsValid, formData.steamApiKeyIsValid]);

    const handleServerSelection = (e: ChangeEvent<HTMLInputElement>) => {
        const { id } = e.target;
        const sid = parseInt(id.substring(1));
        const newState: OptionsProps = { ...formData };
        if (newState.orgServers && newState.orgServers[sid]) {
            newState.orgServers[sid].checked =
                !newState.orgServers[sid].checked;
            setFormData(newState);
        }
        console.log("Toggling server selection");
        setFormData((prevState) => ({
            ...prevState,
            saveButtonText: "Save options",
        }));
    };

    const handleSave = () => {
        const options = { ...formData };
        Browser.storage.local
            .set({
                ...options,
            })
            .then(() => {
                setFormData((prevState) => ({
                    ...prevState,
                    saveButtonText: "Options saved!",
                }));
            })
            .catch(() => {});
    };

    const getMyServers = () => {
        setFormData((prevState) => ({
            ...prevState,
            saveButtonText: "Refreshing server list...",
        }));

        getServers({
            key: formData.battlemetricsApiToken,
        })
            .then((response) => {
                if (response.serverList.servers) {
                    const newState = { ...formData };
                    const orgServers = [];
                    for (const [key, value] of Object.entries(
                        response.serverList.servers,
                    )) {
                        orgServers.push({
                            checked: true,
                            server: {
                                name: value.attributes.name,
                                id: value.id,
                                ip: value.attributes.ip,
                                port: value.attributes.port,
                            },
                        });
                    }
                    newState["orgServers"] = orgServers;
                    newState["battlemetricsApiTokenIsValid"] = true;
                    newState["refreshingServers"] = false;
                    newState["saveButtonText"] = "Save options";
                    setFormData(newState);
                } else {
                    const newState = { ...formData };
                    newState["orgServers"] = [];
                    newState["battlemetricsApiTokenIsValid"] = false;
                    newState["refreshingServers"] = false;
                    setFormData(newState);
                }
            })
            .catch(() => {});
    };

    const handleRefreshServers = () => {
        const newState = { ...formData };
        newState["refreshingServers"] = true;
        setFormData(newState);
        getMyServers();
    };

    return (
        <div className={css.options_form}>
            <h1>
                <img src="./icons/icon_128.png" style={{}} />
                <span className={css.text}>
                    Better Battlemetrics Tools{" "}
                    <span className={css.version}>v{version.version}</span>
                </span>
            </h1>
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
                        required={true}
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
                        required={true}
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
                    <Servers
                        serverList={formData.orgServers}
                        onChange={handleServerSelection}
                        refreshingServers={formData.refreshingServers}
                        onClick={handleRefreshServers}
                    />
                ) : (
                    <Spinner />
                )}
                <button
                    type="button"
                    disabled={!formData.saveEnabled}
                    onClick={handleSave}
                >
                    {formData.saveEnabled
                        ? formData.saveButtonText
                        : "Fill the required fields"}
                </button>
            </form>
        </div>
    );
}
