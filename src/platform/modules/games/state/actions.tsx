import * as types from './constants';
import {ReasonEnded, State, Status} from './reducer';
import {ActionCreateType} from "../../../../util/util";
import {Bet} from "../../../../../../dicether_state-channel/src/types";


const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;


export const creatingGame = ca((hashChain: Array<string>, serverEndHash: string, value: number, transactionHash?: string) => {
    return {type: types.CREATING_GAME, hashChain, value, serverEndHash, createTransactionHash: transactionHash}
});

export const endedWithReason = ca((reason: ReasonEnded) => {
    return {type: types.ENDED_WITH_REASON, reason};
});

export const gameCreated = ca((gameId: number) => {
    return {type: types.GAME_CREATED, gameId}
});

export const addBet = ca((bet: Bet, serverSig: string, playerSig: string) => {
    return {type: types.PLACE_BET, bet, serverSig, playerSig};
});

export const revealSeed = ca((serverSeed: string, playerSeed: string, balance: number) => {
    return {type: types.END_BET, serverSeed, playerSeed, balance};
});

export const endedGame = ca((roundId: number, serverHash: string, playerHash: string, serverSig: string, playerSig: string, endTransactionHash: string) => {
    return {type: types.ENDED_GAME, roundId, serverHash, playerHash, serverSig, playerSig, endTransactionHash};
});


export const userInitiateConflictEnd = ca((transactionHash: string) => {
    return {type: types.USER_INITIATE_CONFLICT_END, transactionHash};
});

export const userAbortConflictEnd = ca(() => {
   return {type: types.USER_ABORT_CONFLICT_END};
});

export const userConflictEnd = ca(() => {
   return {type: types.USER_CONFLICT_END};
});

export const userInitiateForceEnd = ca((transactionHash: string) => {
   return {type: types.USER_INITIATE_FORCE_END, transactionHash};
});

export const userAbortForceEnd = ca(() => {
   return {type: types.USER_ABORT_FORCE_END};
});

export const serverConflictEnd = ca(() => {
    return {type: types.SERVER_CONFLICT_END};
});


export const restoreState = ca((state: State) => {
    return {type: types.RESTORE_STATE, state};
});

export const clearState = ca(() => {
    return {type: types.CLEAR_STATE};
});
