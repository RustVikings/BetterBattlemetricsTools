import React, { JSX, InputHTMLAttributes } from "react";
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

export function TextInput(props: TextInputProps): JSX.Element {
    // console.log(props.name + " rendered");
    // console.log("inputIsValid: " + props.inputIsValid);
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
            <input
                type="text"
                id={props?.name}
                name={props?.name}
                placeholder={props?.placeholder}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
            />
            <span className={css.error_message}>{props.errorMessage}</span>
            {props.permissions ? (
                <span className={css.permissions}>{props.permissions}</span>
            ) : null}
        </div>
    );
}
