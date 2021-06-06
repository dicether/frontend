import * as React from "react";
import {Modal as BootstrapModal, ModalBody} from "reactstrap";

import {BaseType} from "./BaseType";

import Style from "./Modal.scss";

export interface Props extends BaseType {
    isOpen: boolean;
    children: React.ReactNode;
    fade?: boolean;

    toggle?(): void;
}

const Modal = ({isOpen, toggle, children, ...rest}: Props) => (
    <BootstrapModal isOpen={isOpen} toggle={toggle} {...rest}>
        <ModalBody>
            <button type="button" className="close" aria-label="Close" onClick={toggle}>
                <span aria-hidden="true">&times;</span>
            </button>
            <div className={Style.modalWrapper}>{children}</div>
        </ModalBody>
    </BootstrapModal>
);

export default Modal;
