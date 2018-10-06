import * as React from "react";
import {connectModal, InjectedProps} from "redux-modal";

import {Modal} from "../../../reusable";
import Register from "../user/Register";

type Props = InjectedProps;

const MissingWalletModal = ({show, handleHide}: Props) => (
    <Modal toggle={handleHide} isOpen={show}>
        <Register />
    </Modal>
);

export default connectModal({name: "register"})(MissingWalletModal);
