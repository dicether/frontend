import {getSelectedCoins} from "@dicether/state-channel";
import * as React from "react";

import Grid from "../../../../pages/games/chooseFrom12/components/Grid";

type Props = {
    betNum: number;
    resultNum: number;
};

const ChooseFrom12BetInfo = ({betNum, resultNum}: Props) => {
    const selectedCoins = getSelectedCoins(betNum);

    return <Grid selectedCoins={selectedCoins} showResult result={{num: resultNum, won: selectedCoins[resultNum]}} />;
};

export default ChooseFrom12BetInfo;
