import * as React from 'react';
import ClassNames from 'classnames';
import {BaseType} from "./BaseType";


export interface Props extends BaseType {
    id: string,
    value: string | number,
    className?: string
}

const Output = ({id, value, className}: Props) => {
    const classNames = ClassNames(
        className,
        'form-control'
    );

    return (
        <span id={id} className={classNames}>{value}</span>
    )
};

export default Output;
