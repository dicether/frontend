import {User} from "../account/types";

export type Bet = {
    id: number;
    timestamp: Date;
    profit: number;
    user: User;
    roundId: number;
    gameType: number;
    num: number;
    resultNum: number;
    value: number;
    balance: number;
    serverHash: string;
    serverSeed: string;
    userHash: string;
    userSeed: string;
    serverSig: string;
    userSig: string;
    gameId: number;
    contractAddress: string;
};
