import * as React from "react";
import {Label as BootstrapLabel} from "reactstrap";

import {ColumnProps} from "reactstrap/types/lib/Col";
import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    for?: string;
    children: React.ReactNode;
    xs?: ColumnProps;
    sm?: ColumnProps;
    md?: ColumnProps;
    lg?: ColumnProps;
    xl?: ColumnProps;
}

const Label = ({for: htmlFor, ...rest}: Props) => <BootstrapLabel for={htmlFor} {...rest} />;

export default Label;
