import * as React from 'react';
import {Modal as BootstrapModal, ModalBody, ModalHeader as BootstrapModalHeader} from 'reactstrap';

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
        <ModalBody>
            <button type="button" className="close" aria-label="Close" onClick={toggle}>
                <span aria-hidden="true">&times;</span>
            </button>
            <div style={{padding: "1rem"}}>
                {children}
            </div>
        </ModalBody>
    </BootstrapModal>
);

export default Modal;
