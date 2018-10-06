import * as React from "react";

import {Stats} from "../../../../platform/modules/account/types";
import {Ether} from "../../../../reusable/index";

const Style = require("./GameStats.scss");

type EntryProps = {
    value: number;
    name: string;
    colored?: boolean;
    ether?: boolean;
};

const StatsEntry = ({value, name, colored = false, ether = true}: EntryProps) => (
    <div className={Style.entry}>
        <dt className={Style.entry__header}>{name}</dt>
        <dd> {ether ? <Ether colored={colored} gwei={value} /> : value}</dd>
    </div>
);

type Props = {
    stats: Stats;
};

const GameStats = ({stats}: Props) => {
    const {profit, wagered, numBets} = stats;
    return (
        <dl className={Style.stats}>
            <StatsEntry value={wagered} name={"Wagered"} />
            <StatsEntry colored value={profit} name={"Profit"} />
            <StatsEntry ether={false} value={numBets} name={"#Bets"} />
        </dl>
    );
};

export default GameStats;
