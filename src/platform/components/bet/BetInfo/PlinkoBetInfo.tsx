import * as React from "react";
import {connect} from "react-redux";

import Plinko from "../../../../pages/games/plinko/components/Plinko";
import {State} from "../../../../rootReducer";
import {popCnt} from "../../../../util/math";

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

const PlinkoBetInfo = ({nightMode, betNum, resultNum}: Props) => {
    const risk = Math.floor(betNum / 100);
    const rows = betNum % 100;
    const resultColumn = popCnt(resultNum);

    return <Plinko nightMode={nightMode} rows={rows} risk={risk} showResult={true} resultColumn={resultColumn} />;
};

export default connect(mapStateToProps)(PlinkoBetInfo);
