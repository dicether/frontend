import {User} from "../../platform/modules/account/types";

export interface Stat {
    user: User;
    value: number;
}

export interface StatEntry {
    mostWagered: Stat[];
    mostProfit: Stat[];
}

export interface Stats {
    day: StatEntry;
    week: StatEntry;
    month: StatEntry;
    all: StatEntry;
}
