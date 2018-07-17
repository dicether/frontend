import * as React from 'react';
import {Table as BootstrapTable} from 'reactstrap';

import {BaseType} from "./BaseType";

const Style = require("./Table.scss");


export interface Props extends BaseType {
    children: React.ReactNode,
    bordered?: boolean,
    striped?: boolean,
    dark?: boolean,
    hover?: boolean
    responsive?: boolean
    noBorders?: boolean
}


const Table = ({children, bordered = false, striped = false, dark = false, hover = false, noBorders = false, ...rest}: Props) => (
    <BootstrapTable
        className={noBorders ? Style.noBorders : undefined}
        children={children}
        bordered={bordered}
        striped={striped}
        dark={dark}
        hover={hover}
        {...rest}
    />
);

export default Table;
