import ClassNames from "classnames";
import * as React from "react";

import * as Style from "./Coins.scss";
import CoinHead from "assets/images/inline/coinHead.svg";
import CoinNumber from "assets/images/inline/coinNumber.svg";

const coins = [<CoinHead key={1} width="100%" heigth="auto" />, <CoinNumber key={2} width="100%" heigth="auto" />];

interface CoinProps {
    num: number;
    selected: boolean;
    won?: boolean;
    onClick?(num: number): void;
}

const Coin = ({num, won, selected, onClick}: CoinProps) => {
    const classNames = ClassNames(Style.coin, {
        [Style.coin_selected]: selected && won === undefined,
        [Style.coin_won]: won === true,
        [Style.coin_lost]: won === false,
        [Style.button]: onClick !== undefined,
    });

    return onClick ? (
        <button className={classNames} onClick={() => onClick(num)}>
            {coins[num]}
        </button>
    ) : (
        <span className={classNames}>{coins[num]}</span>
    );
};

function wonStatus(num: number, result: {num: number; won: boolean}, showResult: boolean) {
    if (!showResult || num !== result.num) {
        return undefined;
    }

    return result.won;
}

export interface Props {
    selectedCoin: number;
    result: {won: boolean; num: number};
    showResult: boolean;
    onClick?(num: number): void;
}

const Coins = ({selectedCoin, result, showResult, onClick}: Props) => {
    return (
        <div className={Style.coins}>
            <Coin num={0} selected={selectedCoin === 0} won={wonStatus(0, result, showResult)} onClick={onClick} />
            <Coin num={1} selected={selectedCoin === 1} won={wonStatus(1, result, showResult)} onClick={onClick} />
        </div>
    );
};

export default Coins;
