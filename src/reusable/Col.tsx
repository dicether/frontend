import * as React from 'react';
import {Col as BootstrapCol} from 'reactstrap';

import {BaseType} from "./BaseType";
import {ColumnProps} from "reactstrap/lib/Col";

export interface Props extends BaseType {
    children: React.ReactNode
    xs?: ColumnProps;
    sm?: ColumnProps;
    md?: ColumnProps;
    lg?: ColumnProps;
    xl?: ColumnProps;
}

const Col = ({...rest}: Props) => (
    <BootstrapCol {...rest}/>
);

export default Col;
