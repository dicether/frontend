import * as React from "react";
import {Row as BootstrapRow} from "reactstrap";

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    children: React.ReactNode;
    noGutters?: boolean;
}

const Row = ({noGutters, ...rest}: Props) => <BootstrapRow className={noGutters ? "g-0" : undefined} {...rest} />;

export default Row;
