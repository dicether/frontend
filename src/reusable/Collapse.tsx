import * as React from "react";
import {Collapse as BootstrapCollapse} from "reactstrap";

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    isOpen: boolean;
    children: React.ReactNode;
}

const Collapse = ({...rest}: Props) => <BootstrapCollapse {...rest} />;

export default Collapse;
