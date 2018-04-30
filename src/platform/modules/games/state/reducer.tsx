import * as types from './constants'
import {ActionType, assertNever} from "../../../../util/util";
import * as actions from "./actions";


export type Actions = ActionType<typeof actions>;


export type Status =
    'CREATING'
    | 'WAITING_FOR_SERVER'
    | 'ACTIVE'
    | 'CANCELLING'
    | 'ENDED'
    | 'INVALID_SEED' // TODO: remove?
    | 'PLACED_BET'  // TODO: remove?
    | 'SERVER_INITIATED_END'
    | 'PLAYER_INITIATED_END';

export type ReasonEnded =
    'REGULAR_ENDED'
    | 'END_FORCED_BY_SERVER'
    | 'END_FORCED_BY_PLAYER'
    | 'REJECTED_BY_SERVER'
    | 'TRANSACTION_FAILURE'
    | 'CANCELLED_BY_PLAYER';

export type State = {
    status: Status,
    reasonEnded?: ReasonEnded,

    createTransactionHash?: string,
    endTransactionHash?: string,

    gameId?: number,

    hashChain: Array<string>,
    stake: number,

    roundId: number,
    gameType: number,
    num: number,
    betValue?: number,
    balance: number,
    oldBalance: number,
    serverHash?: string,
    playerHash?: string,
    serverSig?: string,
    playerSig?: string,
};


const initialState: State = {
    status: 'ENDED',
    reasonEnded: 'REGULAR_ENDED',

    hashChain: [],
    stake: 0,

    roundId: 0,
    gameType: 0,
    num: 0,
    betValue: 0,
    balance: 0,
    oldBalance: 0
};


export default function state(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case types.CREATING_GAME: return {...initialState /* sic! */,
            status: 'CREATING',
            hashChain: action.hashChain,
            stake: action.value,
            playerHash: action.hashChain[0],
            createTransactionHash: action.createTransactionHash
        };
        case types.WAITING_FOR_SERVER: return {...state,
            status: 'WAITING_FOR_SERVER',
            createTransactionHash: action.createTransactionHash,
            gameId: action.gameId
        };
        case types.CREATE_TRANSACTION_FAILURE: return {...state, status: 'ENDED', reasonEnded: 'TRANSACTION_FAILURE'};
        case types.CANCEL_TRANSACTION_FAILURE: return {
            ...state,
            status: (state.status === 'CANCELLING') ? 'WAITING_FOR_SERVER' : state.status
        };
        case types.CANCELLING: return {...state, status: 'CANCELLING'};
        case types.CANCELLED: return {...state, status: 'ENDED', reasonEnded: 'CANCELLED_BY_PLAYER'};
        case types.GAME_ACCEPTED: return {...state, status: 'ACTIVE', gameId: action.gameId, serverHash: action.serverHash};
        case types.GAME_REJECTED: return {...state, status: 'ENDED', reasonEnded: 'REJECTED_BY_SERVER'};
        case types.ENDED_GAME: return {...state,
            status: 'ENDED',
            reasonEnded: 'REGULAR_ENDED',
            endTransactionHash: action.endTransactionHash,
            roundId: action.roundId,
            gameType: 0,
            num: 0,
            betValue: 0,
            serverHash: action.serverHash,
            playerHash: action.playerHash,
            serverSig: action.serverSig,
            playerSig: action.playerSig,
        };
        case types.PLACE_BET: return {...state,
            status: 'PLACED_BET',
            roundId: action.roundId,
            gameType: action.gameType,
            num: action.num,
            betValue: action.betValue,
            balance: action.balance,
            serverHash: action.serverHash,
            playerHash: action.playerHash,
            serverSig: action.serverSig,
            playerSig: action.playerSig,
        };
        case types.INVALID_SEED: return {...state, status: 'INVALID_SEED'};
        case types.END_BET: return {...state,
            status: 'ACTIVE',
            serverHash: action.serverSeed,
            playerHash: action.playerSeed,
            oldBalance: state.balance,
            balance: action.balance,
        };
        case types.RESTORE_STATE: return {...action.state};
        case types.CHANGE_STATUS: return {...state, status: action.status};
        case types.ENDED_WITH_REASON: return {...state, status: 'ENDED', reasonEnded: action.reason};
        default:
            assertNever(action);
            return state;
    }
}
