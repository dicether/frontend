import * as types from './constants';

import {ActionType, assertNever} from '../../../util/util';
import * as actions from "./actions";
import {MIN_BET_VALUE} from "../../../config/config";


export type Actions = ActionType<typeof actions>;

export type State = {
    num: number,
    value: number,
    reverseRoll: boolean
};


const initialState = {
    num: 50,
    value: MIN_BET_VALUE,
    reverseRoll: false
};


export default function dice(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case types.CHANGE_NUM: return {...state, num: action.num};
        case types.CHANGE_VALUE: return {...state, value: action.value};
        case types.CHANGE_ROLL_MODE: return {...state, reverseRoll: action.reverseRoll};
        default:
            assertNever(action);
            return state;
    }
}
