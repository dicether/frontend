import {createConstant} from '../../util/util';


function c<T>(p: T): T {
    return createConstant(p, 'stats');
}

export const CHANGE_STATS = c('CHANGE_STATS');
