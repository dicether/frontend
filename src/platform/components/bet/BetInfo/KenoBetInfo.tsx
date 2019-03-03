import {getSetBits} from "@dicether/state-channel";
import * as React from "react";

import Grid from "../../../../pages/games/keno/components/Grid";

type Props = {
    betNum: number;
    resultNum: number;
};

const KenoBetInfo = ({betNum, resultNum}: Props) => {
    const selectedTiles = getSetBits(betNum);

    return <Grid selectedTiles={selectedTiles} showResult result={{num: resultNum, betNum}} />;
};

export default KenoBetInfo;
