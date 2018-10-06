import ClassNames from "classnames";
import * as React from "react";
import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    id: string;
    value: string | number;
    className?: string;
}

const Output = ({id, value, className}: Props) => {
    const classNames = ClassNames("form-control", className);

    return (
        <span id={id} className={classNames}>
            {value}
        </span>
    );
};

export default Output;
