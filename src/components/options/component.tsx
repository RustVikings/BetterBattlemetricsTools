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
import { Options, OwnServer } from "@src/types";

export function Options(): JSX.Element {
    const defaultOptions: Options = {
        arkan: true,
        battlemetricsApiToken: "",
        guardian: true,
        rustAdmin: true,
        rustStats: true,
        serverArmour: true,
        steamApiKey: "",
        saveEnabled: false,
        ownServers: [],
        saveButtonText: "Save options",
        refreshingServers: false,
    };

    const [formData, setFormData] = useState<Options>(defaultOptions);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const Options = (await Browser.storage.local.get()) as Options;
                // console.log("loading options from local storage", Options);
                if (Options !== null && Options !== undefined) {
                    if (
                        !Options.battlemetricsApiToken ||
                        !Options.steamApiKey
                    ) {
                        setFormData(defaultOptions);
                    } else {
                        setFormData(Options);
                    }
                }
            } catch (e) {
                console.error("Error loading options from local storage", e);
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
        const { name, value, type, checked } = e.target;
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
            formData.ownServers.length === 0
        ) {
            getUserServers();
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
        const newState: Options = { ...formData };
        if (newState.ownServers && newState.ownServers[sid]) {
            newState.ownServers[sid].checked =
                !newState.ownServers[sid].checked;
            setFormData(newState);
        }

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
            });
    };

    const getUserServers = () => {
        setFormData((prevState) => ({
            ...prevState,
            saveButtonText: "Refreshing server list...",
        }));

        getServers({
            battlemetricsApiToken: formData.battlemetricsApiToken,
        }).then((response) => {
            const servers = response.servers;
            if (response.servers) {
                const newState = { ...formData };
                const ownServers: OwnServer[] = [];
                for (const [key, value] of Object.entries(servers)) {
                    ownServers.push({
                        checked: true,
                        server: {
                            id: value.server.id,
                            ip: value.server.ip,
                            port: value.server.port,
                            name: value.server.name,
                        },
                    });
                }
                newState["ownServers"] = ownServers;
                newState["battlemetricsApiTokenIsValid"] = true;
                newState["refreshingServers"] = false;
                newState["saveButtonText"] = "Save options";
                setFormData(newState);
            } else {
                const newState = { ...formData };
                newState["ownServers"] = [];
                newState["battlemetricsApiTokenIsValid"] = false;
                newState["refreshingServers"] = false;
                setFormData(newState);
            }
        });
    };

    const handleRefreshServers = () => {
        const newState = { ...formData };
        newState["refreshingServers"] = true;
        setFormData(newState);
        getUserServers();
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
                        name="arkan"
                        label="Arkan violations"
                        onChange={handleOnChange}
                        href="https://umod.org/plugins/arkan"
                        checked={formData.arkan}
                    />
                    <Switch
                        showLink={true}
                        name="guardian"
                        label="Guardian violations"
                        onChange={handleOnChange}
                        href="https://umod.org/plugins/guardian"
                        checked={formData.guardian}
                    />
                    <Switch
                        showLink={true}
                        name="rustAdmin"
                        label="RustAdmin shared bans"
                        onChange={handleOnChange}
                        href="https://www.rustadmin.com/"
                        checked={formData.rustAdmin}
                    />
                    <Switch
                        showLink={true}
                        name="serverArmour"
                        label="Server Armour"
                        onChange={handleOnChange}
                        href="https://serverarmour.com/home"
                        checked={formData.serverArmour}
                    />
                    <Switch
                        showLink={true}
                        name="rustStats"
                        label="ruststats.io"
                        onChange={handleOnChange}
                        href="https://ruststats.io/"
                        checked={formData.rustStats}
                    />
                </fieldset>
                {/* render server list when available */}
                {formData.ownServers ? (
                    <Servers
                        serverList={formData.ownServers}
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
