import * as types from './constants';
import {Stats} from './types';
import {ActionCreateType} from "../../../util/util";


const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;


export const changeFirstVisitedS = ca((firstVisited : boolean) => {
    return {type: types.CHANGE_FIRST_VISITED, firstVisited};
});


export const changeJWTS = ca((jwt : string|null) => {
    return {type: types.CHANGE_JWT, jwt};
});


export const changeMyStats = ca((stats: Stats) => {
    return {type: types.CHANGE_USER_STATS, stats};
});
