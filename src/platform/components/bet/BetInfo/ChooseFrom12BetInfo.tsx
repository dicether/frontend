import {getSetBits} from "@dicether/state-channel";
import * as React from "react";

import Grid from "../../../../pages/games/chooseFrom12/components/Grid";

interface Props {
    betNum: number;
    resultNum: number;
}

const ChooseFrom12BetInfo = ({betNum, resultNum}: Props) => {
    const selectedCoins = getSetBits(betNum);

    return <Grid selectedCoins={selectedCoins} showResult result={{num: resultNum, won: selectedCoins[resultNum]}} />;
};

export default ChooseFrom12BetInfo;
