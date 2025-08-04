import {WHEEL_PAYOUT, WHEEL_RESULT_RANGE} from "@dicether/state-channel";
import * as React from "react";
import {connect} from "react-redux";

import WheelGrid from "../../../../pages/games/wheel/components/WheelGrid";
import {State} from "../../../../rootReducer";

interface OtherProps {
    betNum: number;
    resultNum: number;
}

const mapStateToProps = (state: State) => {
    const {app} = state;

    return {
        nightMode: app.nightMode,
    };
};

type Props = ReturnType<typeof mapStateToProps> & OtherProps;

const WheelBetInfo = ({nightMode, betNum, resultNum}: Props) => {
    const angle = 2 * Math.PI - (resultNum * 2 * Math.PI + Math.PI) / WHEEL_RESULT_RANGE;

    const risk = Math.floor(betNum / 100);
    const segments = betNum % 100;
    const allSegments = WHEEL_PAYOUT[risk][segments];
    const payout = {
        show: true,
        value: 0,
        multiplier: allSegments[Math.floor((resultNum * allSegments.length) / WHEEL_RESULT_RANGE)],
    };

    return <WheelGrid nightMode={nightMode} angle={angle} segments={allSegments} payout={payout} />;
};

export default connect(mapStateToProps)(WheelBetInfo);
