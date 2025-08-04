import {Bet, keccak} from "@dicether/state-channel";
import * as Sentry from "@sentry/browser";

import * as actions from "./actions";
import * as types from "./constants";
import {CHAIN_ID} from "../../../../config/config";
import {ActionType, assertNever} from "../../../../util/util";

export type Actions = ActionType<typeof actions>;

export type Status =
    | "CREATING"
    | "ACTIVE"
    | "ENDED"
    | "PLACED_BET" // TODO: remove?
    | "SERVER_INITIATED_CONFLICT_END"
    | "USER_INITIATED_CONFLICT_END"
    | "SERVER_CONFLICT_ENDED"
    | "USER_CONFLICT_ENDED"
    | "USER_INITIATED_FORCE_END";

export type ReasonEnded =
    | "REGULAR_ENDED"
    | "END_FORCED_BY_SERVER"
    | "END_FORCED_BY_USER"
    | "REJECTED_BY_SERVER"
    | "TRANSACTION_FAILURE"
    | "CANCELLED_BY_USER";

export interface State {
    chainId: number;

    status: Status;
    reasonEnded?: ReasonEnded;

    createTransactionHash?: string;
    endTransactionHash?: string;
    forceEndTransactionHash?: string;
    conflictEndTransactionHash?: string;
    conflictEndTime?: Date;
    previousState?: Status; // for user conflict end, force end aborting

    gameId?: number;

    hashChain: string[];
    stake: number;

    roundId: number;
    gameType: number;
    num: number;
    betValue?: number;
    balance: number;
    oldBalance: number;
    serverHash?: string;
    userHash?: string;
    serverSig?: string;
    userSig?: string;
}

const initialState: State = {
    chainId: CHAIN_ID,

    status: "ENDED",

    hashChain: [],
    stake: 0,

    roundId: 0,
    gameType: 0,
    num: 0,
    betValue: 0,
    balance: 0,
    oldBalance: 0,
};

function placeBet(state: State, bet: Bet, serverSig: string, userSig: string): State {
    if (state.status === "ACTIVE" && state.roundId + 1 === bet.roundId) {
        return {
            ...state,
            status: "PLACED_BET",
            roundId: bet.roundId,
            gameType: bet.gameType,
            num: bet.num,
            betValue: bet.value,
            balance: bet.balance,
            serverHash: bet.serverHash,
            userHash: bet.userHash,
            serverSig,
            userSig,
        };
    } else {
        Sentry.captureMessage("Unexpected place bet in reducer!");
        return state;
    }
}

function revealSeed(state: State, serverSeed: string, userSeed: string, balance: number): State {
    if (state.status === "PLACED_BET" && state.userHash === keccak(userSeed)) {
        return {
            ...state,
            status: "ACTIVE",
            serverHash: serverSeed,
            userHash: userSeed,
            oldBalance: state.balance,
            balance,
        };
    } else {
        Sentry.captureMessage("Unexpected reveal seed in reducer!");
        return state;
    }
}

export default function state(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case types.CREATING_GAME:
            return {
                ...initialState /* sic! */,
                status: "CREATING",
                hashChain: action.hashChain,
                stake: action.value,
                userHash: action.hashChain[0],
                serverHash: action.serverEndHash,
                createTransactionHash: action.createTransactionHash,
            };
        case types.GAME_CREATED:
            return {...state, status: "ACTIVE", gameId: action.gameId};
        case types.ENDED_GAME:
            return {
                ...state,
                status: "ENDED",
                reasonEnded: "REGULAR_ENDED",
                endTransactionHash: action.endTransactionHash,
                roundId: action.roundId,
                gameType: 0,
                num: 0,
                betValue: 0,
                serverHash: action.serverHash,
                userHash: action.userHash,
                serverSig: action.serverSig,
                userSig: action.userSig,
            };
        case types.PLACE_BET:
            return placeBet(state, action.bet, action.serverSig, action.userSig);
        case types.END_BET:
            return revealSeed(state, action.serverSeed, action.userSeed, action.balance);
        case types.ENDED_WITH_REASON:
            return {...state, status: "ENDED", reasonEnded: action.reason};
        case types.USER_INITIATE_CONFLICT_END:
            return {
                ...state,
                status: "USER_INITIATED_CONFLICT_END",
                conflictEndTransactionHash: action.transactionHash,
                previousState: state.status,
            };
        case types.USER_ABORT_CONFLICT_END:
        case types.USER_ABORT_FORCE_END:
            return {
                ...state,
                status: state.previousState!,
                previousState: undefined,
            };
        case types.USER_CONFLICT_END:
            return {
                ...state,
                status: "USER_CONFLICT_ENDED",
                conflictEndTime: action.time,
            };
        case types.USER_INITIATE_FORCE_END:
            return {
                ...state,
                status: "USER_INITIATED_FORCE_END",
                forceEndTransactionHash: action.transactionHash,
                previousState: state.status,
            };
        case types.SERVER_CONFLICT_END:
            return {
                ...state,
                status: "SERVER_CONFLICT_ENDED",
            };
        case types.RESTORE_STATE:
            return {...action.state};
        case types.CLEAR_STATE:
            return initialState;
        default:
            assertNever(action);
            return state;
    }
}
