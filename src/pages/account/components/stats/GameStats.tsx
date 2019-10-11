import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";

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

interface Props extends WithTranslation {
    stats: Stats;
}

const GameStats = ({stats, t}: Props) => {
    const {profit, wagered, numBets} = stats;
    return (
        <dl className={Style.stats}>
            <StatsEntry value={wagered} name={t("wagered")} />
            <StatsEntry colored value={profit} name={t("profit")} />
            <StatsEntry ether={false} value={numBets} name={t("#bets")} />
        </dl>
    );
};

export default withTranslation()(GameStats);
