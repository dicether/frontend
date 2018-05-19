import {createConstant} from '../../../../util/util';


function c<T>(p: T): T {
    return createConstant(p, 'games/state');
}


export const CREATING_GAME = c('CREATING_GAME');
export const WAITING_FOR_SERVER = c('WAITING_FOR_SERVER');
export const CREATE_TRANSACTION_FAILURE = c('CREATE_TRANSACTION_FAILURE');
export const CANCEL_TRANSACTION_FAILURE = c('CANCEL_TRANSACTION_FAILURE');
export const CANCELLING = c('CANCELLING');
export const CANCELLED = c('CANCELLED'); // player called contract cancelled before server accepted or rejected
export const GAME_ACCEPTED = c('GAME_ACCEPTED');
export const GAME_REJECTED = c('GAME_REJECTED');
export const ENDED_GAME = c('ENDED_GAME');
export const PLACE_BET = c('PLACE_BET');
export const INVALID_SEED = c('INVALID_SEED');
export const END_BET = c('END_BET');
export const RESTORE_STATE = c('RESTORE_STATE');
export const CHANGE_STATUS = c('CHANGE_STATUS');
export const ENDED_WITH_REASON = c('ENDED_WITH_REASON');
export const SET_CREATE_TRANSACTION_HASH = c('SET_CREATE_TRANSACTION_HASH');
