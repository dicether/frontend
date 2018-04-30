import * as React from 'react';
import {Table as BootstrapTable} from 'reactstrap';

import {BaseType} from "./BaseType";


export interface Props extends BaseType {
    children: React.ReactNode,
    bordered?: boolean,
    striped?: boolean,
    inverse?: boolean,
    hover?: boolean
    responsive?: boolean
}


const Table = ({children, bordered = false, striped = false, inverse = false, hover = false, ...rest}: Props) => (
    <BootstrapTable
        children={children}
        bordered={bordered}
        striped={striped}
        inverse={inverse}
        hover={hover}
        {...rest}
    />
);

export default Table;
