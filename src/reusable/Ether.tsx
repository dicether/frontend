import * as React from 'react';
import ClassNames from "classnames";

const Style = require('./Ether.scss');

export function formatEth(gwei: number, precision = 9) {
    return (gwei / 1e9).toFixed(precision);
}

const Ether = ({gwei, showCurrencySymbol = true, colored = false}: { gwei: number, showCurrencySymbol?: boolean, colored?: boolean }) => {
    const ether = formatEth(gwei);
    const classNames = ClassNames(
        Style.ether,
        {[Style.ether_positiv]: colored && gwei > 0},
        {[Style.ether_negativ]: colored && gwei < 0}
    );

    return <span className={classNames}>{ether}{showCurrencySymbol && ' ETH'}</span>;
};

export default Ether;
