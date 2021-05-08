import * as React from "react";
import {ModalBody as BootstrapModalBody} from "reactstrap";

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    children: React.ReactNode;
}

const ModalBody = ({...rest}: Props) => <BootstrapModalBody {...rest} />;

export default ModalBody;
