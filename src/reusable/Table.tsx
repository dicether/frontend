import ClassNames from "classnames";
import * as React from "react";
import {Table as BootstrapTable} from "reactstrap";

import {BaseType} from "./BaseType";

import Style from "./Table.scss";

export interface Props extends BaseType {
    children: React.ReactNode;
    bordered?: boolean;
    striped?: boolean;
    dark?: boolean;
    hover?: boolean;
    responsive?: boolean;
    noBorders?: boolean;
}

const Table = ({
    children,
    bordered = false,
    striped = false,
    dark = false,
    hover = false,
    noBorders = false,
    className,
    ...rest
}: Props) => {
    const classNames = ClassNames(className, {
        [Style.noBorders]: noBorders,
    });
    return (
        <BootstrapTable
            className={classNames}
            bordered={bordered}
            striped={striped}
            dark={dark}
            hover={hover}
            {...rest}
        >
            {children}
        </BootstrapTable>
    );
};

export default Table;
