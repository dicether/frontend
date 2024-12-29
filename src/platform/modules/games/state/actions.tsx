import {Bet} from "@dicether/state-channel";

import {ActionCreateType} from "../../../../util/util";
import * as types from "./constants";
import {ReasonEnded, State} from "./reducer";

const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;

export const creatingGame = ca(
    (hashChain: string[], serverEndHash: string, value: number, transactionHash?: string) => {
        return {type: types.CREATING_GAME, hashChain, value, serverEndHash, createTransactionHash: transactionHash};
    },
);

export const endedWithReason = ca((reason: ReasonEnded) => {
    return {type: types.ENDED_WITH_REASON, reason};
});

export const gameCreated = ca((gameId: number) => {
    return {type: types.GAME_CREATED, gameId};
});

export const addBet = ca((bet: Bet, serverSig: string, userSig: string) => {
    return {type: types.PLACE_BET, bet, serverSig, userSig};
});

export const revealSeed = ca((serverSeed: string, userSeed: string, balance: number) => {
    return {type: types.END_BET, serverSeed, userSeed, balance};
});

export const endedGame = ca(
    (
        roundId: number,
        serverHash: string,
        userHash: string,
        serverSig: string,
        userSig: string,
        endTransactionHash: string,
    ) => {
        return {type: types.ENDED_GAME, roundId, serverHash, userHash, serverSig, userSig, endTransactionHash};
    },
);

export const userInitiateConflictEnd = ca((transactionHash: string) => {
    return {type: types.USER_INITIATE_CONFLICT_END, transactionHash};
});

export const userAbortConflictEnd = ca(() => {
    return {type: types.USER_ABORT_CONFLICT_END};
});

export const userConflictEnd = ca((time: Date) => {
    return {type: types.USER_CONFLICT_END, time};
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
