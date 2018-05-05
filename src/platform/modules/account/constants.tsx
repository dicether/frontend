import {createConstant} from '../../../util/util';


function c<T>(p: T): T {
    return createConstant(p, 'account');
}

export const CHANGE_FIRST_VISITED= c('CHANGE_FIRST_VISITED');
export const CHANGE_JWT= c('CHANGE_JWT');
export const CHANGE_USER_STATS= c('CHANGE_USER_STATS');
export const CHANGE_USER_BETS= c('CHANGE_USER_BETS');
export const CHANGE_GAME_SESSIONS = c('CHANGE_GAME_SESSIONS');
