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
            <button type="button" className={"btn-close " + Style.close} aria-label="Close" onClick={toggle} />
            <div className={Style.modalWrapper}>{children}</div>
        </ModalBody>
    </BootstrapModal>
);

export default Modal;
