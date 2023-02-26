import * as React from "react";
import {Col as BootstrapCol} from "reactstrap";
import {ColumnProps} from "reactstrap/types/lib/Col";

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    children: React.ReactNode;
    order?: string | number;
    xs?: ColumnProps;
    sm?: ColumnProps;
    md?: ColumnProps;
    lg?: ColumnProps;
    xl?: ColumnProps;
}

const Col = ({...rest}: Props) => <BootstrapCol {...rest} />;

export default Col;
