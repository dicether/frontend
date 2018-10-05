import * as React from "react";
import {connectModal, InjectedProps} from "redux-modal";

import {MissingWallet, Modal} from "../../../reusable";

type Props = InjectedProps

const MissingWalletModal = ({show, handleHide}: Props) => (
    <Modal toggle={handleHide} isOpen={show} >
        <MissingWallet/>
    </Modal>
);

export default connectModal({name: "missingWallet"})(MissingWalletModal);
