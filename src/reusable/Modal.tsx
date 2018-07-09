import * as React from 'react';
import {Modal as BootstrapModal, ModalBody} from 'reactstrap';

import {BaseType} from "./BaseType";

const Style = require('./Modal.scss');

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
            <div className={Style.wrapper}>
                {children}
            </div>
        </ModalBody>
    </BootstrapModal>
);

export default Modal;
