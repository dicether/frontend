import * as React from "react";
import {connectModal, InjectedProps} from "redux-modal";

import {Modal} from "../../../reusable";
import {Bet as BetType} from "../../modules/bets/types";
import Bet from "../bet/Bet";

type Props = InjectedProps & {bet?: BetType; betId?: number};

const BetModal = ({show, handleHide, bet, betId}: Props) => (
    <Modal toggle={handleHide} isOpen={show}>
        <Bet betId={betId} bet={bet} />
    </Modal>
);

export default connectModal({name: "bet"})(BetModal);
