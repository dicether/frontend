import BN from "bn.js";
import * as React from "react";

import Tile from "./Tile";

import * as Style from "./Grid.scss";

function wonStatus(tileNum: number, betNum: number, resultNum: number, showResult: boolean) {
    const resultNumBn = new BN(resultNum);
    const tileBit = new BN(1).shln(tileNum);
    if (!showResult || resultNumBn.and(tileBit).toNumber() === 0) {
        return undefined;
    }

    const betNumBn = new BN(betNum);

    return betNumBn.and(resultNumBn).and(tileBit).toNumber() !== 0;
}

export type Props = {
    selectedTiles: boolean[];
    result: {betNum: number; num: number};
    showResult: boolean;
    onClick?(num: number): void;
};

const tileNums = [...Array(40).keys()];

const Grid = ({selectedTiles, result, showResult, onClick}: Props) => (
    <div className={Style.grid}>
        <div className={Style.tiles}>
            {tileNums.map((num) => (
                <Tile
                    key={num}
                    num={num}
                    onClick={onClick}
                    selected={selectedTiles[num]}
                    won={wonStatus(num, result.betNum, result.num, showResult)}
                />
            ))}
        </div>
    </div>
);

export default Grid;
