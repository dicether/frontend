import * as React from "react";

import DiceBetInfo from "./DiceBetInfo";
import Overview from "./Overview";
import VerificationInfo from "./VerificationInfo";

import {Bet} from "../../../modules/bets/types";

type Props = {
    bet: Bet;
};

class BetInfo extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {bet} = this.props;

        return (
            <div>
                <Overview bet={bet} />
                <DiceBetInfo betId={bet.id} betNum={bet.num} resultNum={bet.resultNum} gameType={bet.gameType} />
                <VerificationInfo bet={bet} />
            </div>
        );
    }
}

export default BetInfo;
