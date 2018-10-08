import * as React from "react";

import {DataLoader} from "../../../reusable";
import {Bet, Bet as BetType} from "../../modules/bets/types";
import BetInfo from "./BetInfo";

export type Props = {
    bet?: Bet;
    betId?: number;
};

const Bet = ({bet, betId}: Props) =>
    bet ? (
        <BetInfo bet={bet} />
    ) : (
        <DataLoader<BetType> url={`/bets/bet/${betId}`} success={bet => <BetInfo bet={bet} />} />
    );

export default Bet;
