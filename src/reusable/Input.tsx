import ClassNames from "classnames";
import * as React from "react";
import {useEffect, useRef, useState} from "react";

import {BaseType} from "./BaseType";

import * as Style from "./Input.scss";

export interface Props extends BaseType {
    value: string;
    suffix?: React.ReactNode;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    showValidation?: boolean;
    isValid?: boolean;

    validate?: (value: string) => {valid: boolean; message?: string};
    onValue?: (value: string) => void;
}

const Input = ({
    value,
    suffix,
    disabled = false,
    readOnly,
    placeholder,
    showValidation = false,
    isValid: isValidProp,
    validate,
    onValue,
}: Props) => {
    const [inputValue, setInputValue] = useState(value);
    const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
    const isFocus = useRef(false);

    useEffect(() => {
        if (!isFocus.current) {
            setInputValue(value);
        }
    }, [value]);

    const onBlur = () => {
        isFocus.current = false;
        setInputValue(value);
    };

    const onFocus = () => {
        isFocus.current = true;
    };

    const onChange = (event: React.FormEvent<HTMLInputElement>) => {
        const val = (event.target as HTMLInputElement).value;

        const isValid = validate !== undefined ? validate(val).valid : undefined;
        setInputValue(val);
        setIsValid(isValid);
        if (onValue && isValid !== false) {
            onValue(val);
        }
    };

    const isValidInput = isValidProp ?? isValid;
    const className = ClassNames(
        "form-control",
        {"is-valid": isValidInput === true && showValidation},
        {"is-invalid": isValidInput === false && showValidation},
    );

    const classNameSuffix = ClassNames("form-control", Style.input__suffix);

    return (
        <div className="input">
            <input
                placeholder={placeholder}
                className={className}
                disabled={disabled}
                readOnly={readOnly}
                value={inputValue}
                onBlur={onBlur}
                onChange={onChange}
                onFocus={onFocus}
            />
            {suffix && (
                <div className={classNameSuffix}>
                    <span style={{color: "transparent"}}>{inputValue}</span>
                    {suffix}
                </div>
            )}
        </div>
    );
};

export default Input;
