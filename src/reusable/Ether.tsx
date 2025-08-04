import ClassNames from "classnames";
import * as React from "react";

import * as Style from "./Ether.scss";
import icon from "assets/images/ETH_icon.svg";

export function formatEth(gwei: number, precision = 9) {
    return (gwei / 1e9).toFixed(precision);
}

export interface Props {
    gwei: number;
    showCurrencySymbol?: boolean;
    colored?: boolean;
    precision?: number;
}

const Ether = ({gwei, precision = 9, showCurrencySymbol = false, colored = false}: Props) => {
    const ether = formatEth(gwei, precision);
    const classNames = ClassNames(
        Style.ether,
        {[Style.ether_positiv]: colored && gwei > 0},
        {[Style.ether_negativ]: colored && gwei < 0},
    );

    return (
        <span className={classNames}>
            <span>{ether}</span>
            {showCurrencySymbol && <img className={Style.icon} src={icon} />}
        </span>
    );
};

export default Ether;
