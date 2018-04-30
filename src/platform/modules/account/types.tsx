export type Stats = {
    wagered: number,
    profit: number,
    numBets: number
};

export type Bet = {
    roundId: number,
    value: number,
    won: number|null,
    chance: number
};

export type UserType = 'ADM' | 'MOD' | 'VIP' | 'BOT' | 'USR';

export interface User {
    address: string,
    username: string
    userType: UserType
}
