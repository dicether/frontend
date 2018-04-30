import {createConstant} from '../../../util/util';


function c<T>(p: T): T {
    return createConstant(p, 'games');
}


export const CHANGE_BETS = c('CHANGE_BETS');
export const ADD_BET = c('ADD_BET');
export const CHANGE_MY_BETS = c('CHANGE_MY_BETS');
export const ADD_MY_BET = c('ADD_MY_BET');
