import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {Dispatch} from "../../../../util/util";
import {Bet} from "../../../modules/bets/types";
import {showUserModal} from "../../../modules/modals/actions";
import DiceBetInfo from "./DiceBetInfo";
import Overview from "./Overview";
import VerificationInfo from "./VerificationInfo";

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            showUserModal,
        },
        dispatch
    );

type OtherProps = {
    bet: Bet;
};

type Props = ReturnType<typeof mapDispatchToProps> & OtherProps;

class BetInfo extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {bet, showUserModal} = this.props;

        return (
            <div>
                <Overview bet={bet} showUserModal={user => showUserModal({user})} />
                <DiceBetInfo betId={bet.id} betNum={bet.num} resultNum={bet.resultNum} gameType={bet.gameType} />
                <VerificationInfo bet={bet} />
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(BetInfo);
