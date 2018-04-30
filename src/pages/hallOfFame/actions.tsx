import axios from 'axios';

import * as types from './constants'
import {catchError} from '../../platform/modules/utilities/asyncActions'

import {Stats} from './types';
import {Dispatch} from '../../util/util';


export type Action = { type: typeof types.CHANGE_STATS, stats: Stats}


export function changeStats(stats: Stats): Action {
    return {type: types.CHANGE_STATS, stats};
}

export function getStats() {
    return function (dispatch: Dispatch) {
        axios.get('/stats').then(response => {
            dispatch(changeStats(response.data));
        }).catch(error => catchError(error, dispatch));
    }
}
