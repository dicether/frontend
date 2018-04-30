import * as types from './constants';

import {ActionType, assertNever} from '../../../../util/util';
import * as actions from "./actions";


export type Actions = ActionType<typeof actions>;

export type State = {
    showHelp: boolean,
    showExpertView: boolean,
    sound: boolean
};


const initialState = {
    showHelp: false,
    showExpertView: false,
    sound: true
};


export default function games(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case types.TOGGLE_HELP: return {...state, showHelp: action.show};
        case types.TOGGLE_EXPERT_VIEW: return {...state, showExpertView: action.show};
        case types.TOGGLE_SOUND: return {...state, sound: action.enabled};
        default:
            assertNever(action);
            return state;
    }
}
