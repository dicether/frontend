import ClassNames from "classnames";

import {KENO_DIVIDER, KENO_PAY_OUT} from "@dicether/state-channel";
import * as React from "react";

const Style = require("./PayoutTable.scss");

type EntryProps = {
    hits: number;
    payout: number;
    won?: boolean;
};

const Entry = ({hits, payout, won}: EntryProps) => {
    const className = ClassNames(Style.entry, {
        [Style.entry_won]: won === true,
        [Style.entry_lost]: won === false,
    });

    return (
        <div className={className}>
            <span>{hits} Hits</span>
            <span>{payout}x</span>
        </div>
    );
};

export type Props = {
    selectedTiles: number;
    numHits?: number;
};

const PayoutTable = ({selectedTiles, numHits}: Props) => {
    return (
        <div className={Style.payoutTable}>
            {[...Array(selectedTiles + 1).keys()].map(t => (
                <Entry
                    hits={t}
                    payout={KENO_PAY_OUT[selectedTiles][t] / KENO_DIVIDER}
                    won={numHits === t ? KENO_PAY_OUT[selectedTiles][numHits] > 0 : undefined}
                />
            ))}
        </div>
    );
};

export default PayoutTable;
