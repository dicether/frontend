import {createConstant} from '../util/util';


function c<T>(p: T): T {
    return createConstant(p, 'app');
}

export const CHANGE_NOTIFICATION = c('CHANGE_NOTIFICATION');
export const TOGGLE_THEME = c('TOGGLE_THEME');
