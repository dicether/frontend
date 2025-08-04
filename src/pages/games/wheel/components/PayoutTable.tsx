import ClassNames from "classnames";
import * as React from "react";

import {formatMultiplier} from "./utility";

import * as Style from "./PayoutTable.scss";

interface Props {
    payoutTable: {value: number; color: string}[];
    showMultiplier: boolean;
    multiplier: number;
}

const PayoutInfo = ({multiplier, color, show}: {multiplier: number; color: string; show: boolean}) => {
    const className = ClassNames(Style.colorStrip, {[Style.colorStrip_show]: show});

    return (
        <div className={Style.payoutInfo}>
            <div className={className} style={{backgroundColor: color}} />
            <span className={Style.multiplier}>{formatMultiplier(multiplier)}</span>
        </div>
    );
};

const PayoutTable = ({payoutTable, showMultiplier, multiplier}: Props) => {
    return (
        <div className={Style.payoutTable}>
            {payoutTable.map((p) => (
                <PayoutInfo
                    key={p.value}
                    multiplier={p.value}
                    color={p.color}
                    show={showMultiplier && multiplier === p.value}
                />
            ))}
        </div>
    );
};

export default PayoutTable;
