import {PLINKO_PAYOUT_DIVIDER} from "@dicether/state-channel";
import ClassNames from "classnames";
import * as React from "react";

import * as Style from "./PayoutTable.scss";

export type Props = {
    payout: number[];
    showResult: boolean;
    resultColumn: number;
};

type PayoutInfoProps = {
    showResult: boolean;
    colorClass: string;
    multiplier: number;
};

const PayoutInfo = ({showResult, colorClass, multiplier}: PayoutInfoProps) => {
    const classNamesColorStrip = ClassNames(Style.colorStrip, colorClass, {[Style.colorStrip_show]: showResult});

    const classNamesEntry = ClassNames(Style.resultEntry, {[Style.resultEntry_show]: showResult});

    return (
        <div className={classNamesEntry}>
            <div className={classNamesColorStrip} />
            <span className={Style.multiplier}>{`${multiplier}x`}</span>
        </div>
    );
};

const PayoutTable = ({payout, showResult, resultColumn}: Props) => {
    const len = payout.length;
    const totalPayout = [...payout.slice(1).reverse(), ...payout];
    const color = [...Array(len).keys()].map((x) => Style[`colorStrip-${(len - 1) * 2}-${x}`]);
    const totalColor = [...color.slice(1).reverse(), ...color];

    return (
        <div className={Style.payoutTable}>
            {totalPayout.map((value, index) => (
                <PayoutInfo
                    key={`${len}-${index}`}
                    showResult={showResult && resultColumn === index}
                    multiplier={value / PLINKO_PAYOUT_DIVIDER}
                    colorClass={totalColor[index]}
                />
            ))}
        </div>
    );
};

export default PayoutTable;
