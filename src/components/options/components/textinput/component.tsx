import React, { JSX, InputHTMLAttributes, useState } from "react";
import css from "../../styles.module.css";
import classNames from "classnames";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    errorMessage: string;
    href: string;
    inputIsValid: boolean | undefined;
    label: string;
    permissions?: string;
    required: boolean;
}

interface VisibilityButtonProps {
    visible: boolean;
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export function VisibilityButton({
    visible,
    setVisibility,
}: VisibilityButtonProps): JSX.Element {
    const handleVisibilityToggle = () => {
        setVisibility((prev) => !prev);
    };

    return (
        <button
            type="button"
            className={classNames(css.button, css.refresh)}
            onClick={handleVisibilityToggle}
        >
            <img
                src={visible ? "./icons/visible.svg" : "./icons/invisible.svg"}
                title="Refresh servers"
                alt="Refresh server"
            />
        </button>
    );
}

export function TextInput(props: TextInputProps): JSX.Element {
    const [visibility, setVisibility] = useState<boolean>(false);

    return (
        <div
            className={
                props.inputIsValid || undefined
                    ? classNames([css.form_component])
                    : classNames([css.form_component, css.error_state])
            }
        >
            <label htmlFor={props.name}>
                {props.label + " "}
                {props.required ? (
                    <span className={css.required}>(required)</span>
                ) : (
                    ""
                )}
                <a href={props?.href} target="_blank" rel="noopener noreferrer">
                    <img
                        className="siz"
                        src="./icons/link.svg"
                        style={{
                            display: "inline",
                            width: "18px",
                            height: "18px",
                        }}
                    />
                </a>
            </label>
            <div className={css.input_visibility}>
                <input
                    type={visibility ? "text" : "password"}
                    id={props?.name}
                    name={props?.name}
                    placeholder={props?.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                    onFocus={props.onFocus}
                />
                <VisibilityButton
                    visible={visibility || false}
                    setVisibility={setVisibility}
                />
            </div>
            <span className={css.error_message}>{props.errorMessage}</span>
            {props.permissions ? (
                <span className={css.permissions}>{props.permissions}</span>
            ) : null}
        </div>
    );
}
