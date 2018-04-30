import * as React from 'react';
import {Modal as BootstrapModal, ModalHeader as BootstrapModalHeader} from 'reactstrap';

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    isOpen: boolean,
    children: React.ReactNode,
    title?: string,
    fade?: boolean,

    toggle?(): void,
}

const Modal = ({isOpen, toggle, children, title, ...rest}: Props) => (
    <BootstrapModal isOpen={isOpen} toggle={toggle} {...rest}>
        {title &&
            <BootstrapModalHeader toggle={toggle}>{title}</BootstrapModalHeader>
        }
        {children}
    </BootstrapModal>
);

export default Modal;
