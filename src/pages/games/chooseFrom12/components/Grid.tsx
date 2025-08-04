import * as React from "react";

import Tile from "./Tile";

import * as Style from "./Grid.scss";

function wonStatus(num: number, result: {num: number; won: boolean}, showResult: boolean) {
    if (!showResult || num !== result.num) {
        return undefined;
    }

    return result.won;
}

export interface Props {
    selectedCoins: boolean[];
    result: {num: number; won: boolean};
    showResult: boolean;
    onClick?(num: number): void;
}

const coinNums = [...Array(12).keys()];

const Grid = ({selectedCoins, result, showResult, onClick}: Props) => (
    <div className={Style.grid}>
        <div className={Style.tiles}>
            {coinNums.map((num) => (
                <Tile
                    key={num}
                    num={num}
                    onClick={onClick}
                    selected={selectedCoins[num]}
                    won={wonStatus(num, result, showResult)}
                />
            ))}
        </div>
    </div>
);

export default Grid;
