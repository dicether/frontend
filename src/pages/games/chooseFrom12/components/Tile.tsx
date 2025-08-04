import ClassNames from "classnames";
import * as React from "react";

import * as Style from "./Tile.scss";

interface TileContentProps {
    num: number;
    selected: boolean;
    won?: boolean;
}

const TileContent = ({num, selected, won}: TileContentProps) => {
    const classNames = ClassNames(Style.numContent, {
        [Style.numContent_selected]: selected,
        [Style.numContent_won]: won === true,
        [Style.numContent_lost]: won === false,
    });

    return (
        <div className={classNames}>
            <span className={Style.num}>{num}</span>
        </div>
    );
};

interface Props {
    num: number;
    selected: boolean;
    won?: boolean;
    onClick?: (num: number) => void;
}

const Tile = ({num, selected, won, onClick}: Props) => {
    return onClick ? (
        <button className={Style.button} onClick={() => onClick(num)}>
            <TileContent num={num} selected={selected} won={won} />
        </button>
    ) : (
        <div className={Style.button}>
            <TileContent num={num} selected={selected} won={won} />
        </div>
    );
};

export default Tile;
