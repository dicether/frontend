import * as React from 'react';
import {ModalFooter as BootstrapModalFooter} from 'reactstrap';

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    children: React.ReactNode
}

const ModalFooter = ({children, ...rest}: Props) => (
    <BootstrapModalFooter>
        {children}
    </BootstrapModalFooter>
);

export default ModalFooter;
