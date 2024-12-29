import * as React from "react";

import {Modal} from "../../../reusable";
import Bet from "../bet/Bet";
import {connect} from "react-redux";
import {State} from "../../../rootReducer";
import {Dispatch} from "../../../util/util";

import {hideBetModal} from "../../modules/modals/slice";

const mapStateToProps = ({modal}: State) => {
    const {betModal} = modal;
    const {showBetModal: show, betId, bet} = betModal;
    return {
        show,
        bet,
        betId,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    hide: () => dispatch(hideBetModal()),
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const BetModal = ({show, hide, bet, betId}: Props) => (
    <Modal toggle={hide} isOpen={show}>
        {show && <Bet betId={betId} bet={bet} />}
    </Modal>
);

export default connect(mapStateToProps, mapDispatchToProps)(BetModal);
