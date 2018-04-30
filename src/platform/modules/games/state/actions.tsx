import * as types from './constants';
import {ReasonEnded, State, Status} from './reducer';
import {ActionCreateType} from "../../../../util/util";


const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;


export const creatingGame = ca((hashChain: Array<string>, value: number, transactionHash?: string) => {
    return {type: types.CREATING_GAME, hashChain, value, createTransactionHash: transactionHash}
});


export const transactionFailure = ca(() => {
    return {type: types.CREATE_TRANSACTION_FAILURE};
});


export const cancelTransactionFailure = ca(() => {
    return {type: types.CANCEL_TRANSACTION_FAILURE};
});


export const cancelled = ca(() => {
    return {type: types.CANCELLED};
});

export const endedWithReason = ca((reason: ReasonEnded) => {
    return {type: types.ENDED_WITH_REASON, reason};
});


export const waitingForServer = ca((createTransactionHash: string, gameId: number) => {
    return {type: types.WAITING_FOR_SERVER, createTransactionHash, gameId};
});


export const acceptedGame = ca((gameId: number, serverHash: string) => {
    return {type: types.GAME_ACCEPTED, gameId, serverHash}
});


export const rejectedGame = ca(() => {
    return {type: types.GAME_REJECTED};
});


export const addBet = ca((roundId: number, gameType: number, betValue: number, num: number, balance: number, serverHash: string, playerHash: string,
                serverSig: string, playerSig: string) => {
    return {type: types.PLACE_BET, roundId, gameType, betValue, num, balance, playerHash, serverHash, serverSig, playerSig};
});


export const endBet = ca((serverSeed: string, playerSeed: string, balance: number) => {
    return {type: types.END_BET, serverSeed, playerSeed, balance};
});


export const cancelling = ca(() => {
    return {type: types.CANCELLING};
});


export const invalidSeed = ca(() => {
    return {type: types.INVALID_SEED};
});


export const endedGame = ca((roundId: number, serverHash: string, playerHash: string, serverSig: string, playerSig: string, endTransactionHash: string) => {
    return {type: types.ENDED_GAME, roundId, serverHash, playerHash, serverSig, playerSig, endTransactionHash};
});

export const restoreState = ca((state: State) => {
    return {type: types.RESTORE_STATE, state};
});


export const changeStatus = ca((status: Status) => {
    return {type: types.CHANGE_STATUS, status};
});
