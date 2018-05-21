import * as React from 'react';
import {Label as BootstrapLabel} from 'reactstrap';

import {BaseType} from "./BaseType";
import {ColumnProps} from "reactstrap/lib/Col";

export interface Props extends BaseType {
    for?: string,
    children: React.ReactNode,
    xs?: ColumnProps;
    sm?: ColumnProps;
    md?: ColumnProps;
    lg?: ColumnProps;
    xl?: ColumnProps;
}

const Label = ({for: htmlFor, ...rest}: Props) => (
    <BootstrapLabel for={htmlFor} {...rest}/>
);

export default Label
