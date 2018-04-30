
import {User} from '../../platform/modules/account/types';

export type Stat = {
    user: User,
    value: number
}

export type Stats = {
    mostWagered: Array<Stat>,
    mostWon: Array<Stat>,
    mostProfit: Array<Stat>
}
