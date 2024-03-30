import * as React from "react";

import {MissingWallet, Modal} from "../../../reusable";
import {connect} from "react-redux";
import {State} from "../../../rootReducer";
import {Dispatch} from "../../../util/util";
import {hideMissingWalletModal} from "../../modules/modals/slice";

const mapStateToProps = ({modal}: State) => {
    const {showMissingWalletModal: show} = modal;

    return {
        show,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    hide: () => dispatch(hideMissingWalletModal()),
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const MissingWalletModal = ({show, hide}: Props) => (
    <Modal toggle={hide} isOpen={show}>
        <MissingWallet />
    </Modal>
);

export default connect(mapStateToProps, mapDispatchToProps)(MissingWalletModal);
