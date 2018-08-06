import {createConstant} from '../../../util/util';


function c<T>(p: T): T {
    return createConstant(p, 'games/dice');
}


export const CHANGE_VALUE = c('CHANGE_VALUE');
export const CHANGE_NUM = c('CHANGE_NUM');
export const CHANGE_ROLL_MODE = c('CHANGE_ROLL_MODE');
