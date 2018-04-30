import {combineReducers} from 'redux';

import info, {State as InfoState} from './info/reducer';
import gameState, {State as GameState} from './state/reducer';

export type State = {
    info: InfoState,
    gameState: GameState
}

const reducers = combineReducers( {
    info,
    gameState
});

export default reducers;
