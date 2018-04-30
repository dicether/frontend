import * as types from './constants'

import {Stats} from './types';
import {Action} from './actions';


export type State = Stats;

const initialState = {
    mostWagered: [],
    mostWon: [],
    mostProfit: []
};

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case types.CHANGE_STATS:
            return Object.assign({}, state, {
                mostWagered: action.stats.mostWagered,
                mostWon: action.stats.mostWon,
                mostProfit: action.stats.mostProfit
            });
        default:
            return state;
    }
}
