import * as React from 'react';
import {ModalBody as BootstrapModalBody} from 'reactstrap';

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    children: React.ReactNode
}

const ModalBody = ({children, ...rest}: Props) => (
    <BootstrapModalBody children={children} {...rest} />
);

export default ModalBody;
