import {CHOOSE_FROM_12_NUMS, GameType, maxBet} from "@dicether/state-channel";

import * as actions from "./actions";
import * as types from "./constants";
import {KELLY_FACTOR, MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
import {ActionType, assertNever} from "../../../util/util";

export type Actions = ActionType<typeof actions>;

export interface State {
    num: number;
    value: number;
}

const initialState = {
    num: 1,
    value: MIN_BET_VALUE,
};

function updateNum(state: State, num: number) {
    if (num <= 0 || num >= Math.pow(2, CHOOSE_FROM_12_NUMS) - 1) {
        return state;
    }

    const maxBetValue = maxBet(GameType.CHOOSE_FROM_12, num, MIN_BANKROLL, KELLY_FACTOR);
    const value = Math.min(maxBetValue, state.value);

    return {...state, value, num};
}

export default function dice(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case types.CHANGE_NUM:
            return updateNum(state, action.num);
        case types.CHANGE_VALUE:
            return {...state, value: action.value};
        default:
            assertNever(action);
            return state;
    }
}
