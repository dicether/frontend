import * as React from 'react';

import {Ether} from '../../../../reusable/index';
import {Stats} from "../../../../platform/modules/account/types";

const Style = require('./GameStats.scss');

type EntryProps = {
    value: number,
    name: string,
    colored?: boolean
    ether?: boolean
}

const StatsEntry = ({value, name, colored=false, ether=true}: EntryProps) => (
    <div className={Style.entry}>
        <h5 className={Style.entry__header}>{name}</h5>
        <span> {ether ? <Ether colored={colored} gwei={value}/> : value }</span>
    </div>
);


type Props = {
    stats: Stats
};

const GameStats = ({stats}: Props) => {
    const {profit, wagered, numBets} = stats;
    return (
        <div className={Style.stats}>
            <StatsEntry value={wagered} name={"Wagered"}/>
            <StatsEntry colored value={profit} name={"Profit"}/>
            <StatsEntry ether={false} value={numBets} name={"#Bets"}/>
        </div>);
};

export default GameStats;
