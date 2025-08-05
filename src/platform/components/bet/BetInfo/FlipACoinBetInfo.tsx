import * as React from "react";

import Coins from "../../../../pages/games/flipACoin/components/Coins";

interface Props {
    betNum: number;
    resultNum: number;
}

const FlipACoinBetInfo = ({betNum, resultNum}: Props) => {
    return <Coins selectedCoin={betNum} showResult result={{num: resultNum, won: betNum === resultNum}} />;
};

export default FlipACoinBetInfo;
