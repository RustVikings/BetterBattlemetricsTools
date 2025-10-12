import React, { JSX, InputHTMLAttributes } from "react";
import classNames from "classnames";
import css from "../../styles.module.css";

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
    href?: string;
    label: string;
    showLink: boolean;
}

export function Switch(props: SwitchProps): React.JSX.Element {
    return (
        <div className={classNames([css.form_component, css.switch])}>
            <label className={css.switch_label} htmlFor={props?.name}>
                {props.label + " "}
                <a
                    href={props?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={
                        props.showLink
                            ? { display: "inline" }
                            : { display: "none" }
                    }
                >
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
            <label className={css.switch_checkbox}>
                <input
                    type="checkbox"
                    className="sr-only peer"
                    id={props?.name}
                    name={props?.name}
                    onChange={props.onChange}
                    checked={props.checked}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
}
