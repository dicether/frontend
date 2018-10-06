import {User} from "../../platform/modules/account/types";

export type Stat = {
    user: User;
    value: number;
};

export type StatEntry = {
    mostWagered: Stat[];
    mostProfit: Stat[];
};

export type Stats = {
    day: StatEntry;
    week: StatEntry;
    month: StatEntry;
    all: StatEntry;
};
