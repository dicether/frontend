import {GameType} from "@dicether/state-channel";
import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {Dispatch} from "../../../../util/util";
import {Bet} from "../../../modules/bets/types";
import {showUserModal} from "../../../modules/modals/slice";
import ChooseFrom12BetInfo from "./ChooseFrom12BetInfo";
import DiceBetInfo from "./DiceBetInfo";
import FlipACoinBetInfo from "./FlipACoinBetInfo";
import KenoBetInfo from "./KenoBetInfo";
import Overview from "./Overview";
import PlinkoBetInfo from "./PlinkoBetInfo";
import VerificationInfo from "./VerificationInfo";
import WheelBetInfo from "./WheelBetInfo";

type GameSpecificInfoProps = {
    gameType: number;
    betNum: number;
    resultNum: number;
};

const GameSpecificInfo = ({gameType, betNum, resultNum}: GameSpecificInfoProps) => {
    switch (gameType) {
        case GameType.DICE_LOWER:
        case GameType.DICE_HIGHER:
            return <DiceBetInfo betNum={betNum} resultNum={resultNum} gameType={gameType} />;
        case GameType.CHOOSE_FROM_12:
            return <ChooseFrom12BetInfo betNum={betNum} resultNum={resultNum} />;
        case GameType.FLIP_A_COIN:
            return <FlipACoinBetInfo betNum={betNum} resultNum={resultNum} />;
        case GameType.KENO:
            return <KenoBetInfo betNum={betNum} resultNum={resultNum} />;
        case GameType.WHEEL:
            return <WheelBetInfo betNum={betNum} resultNum={resultNum} />;
        case GameType.PLINKO:
            return <PlinkoBetInfo betNum={betNum} resultNum={resultNum} />;
        default:
            return null;
    }
};

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            showUserModal,
        },
        dispatch,
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
                <Overview bet={bet} showUserModal={(user) => showUserModal({user})} />
                <GameSpecificInfo betNum={bet.num} resultNum={bet.resultNum} gameType={bet.gameType} />
                <VerificationInfo bet={bet} />
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(BetInfo);
