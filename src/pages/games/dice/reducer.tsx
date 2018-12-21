import * as types from "./constants";

import {maxBet} from "@dicether/state-channel";
import {KELLY_FACTOR, MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
import {ActionType, assertNever} from "../../../util/util";
import * as actions from "./actions";

export type Actions = ActionType<typeof actions>;

export type State = {
    num: number;
    value: number;
    reverseRoll: boolean;
};

const initialState = {
    num: 50,
    value: MIN_BET_VALUE,
    reverseRoll: false,
};

function updateNum(state: State, num: number) {
    const maxBetValue = maxBet(state.reverseRoll ? 2 : 1, num, MIN_BANKROLL, KELLY_FACTOR);
    const value = Math.min(maxBetValue, state.value);

    return {...state, value, num};
}

export default function dice(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case types.CHANGE_NUM:
            return updateNum(state, action.num);
        case types.CHANGE_VALUE:
            return {...state, value: action.value};
        case types.CHANGE_ROLL_MODE:
            return {...state, reverseRoll: action.reverseRoll};
        default:
            assertNever(action);
            return state;
    }
}
