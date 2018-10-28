import * as types from "./constants";

import {CHOOSE_FROM_12_NUMS, GameType, maxBet} from "@dicether/state-channel";
import {MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
import {ActionType, assertNever} from "../../../util/util";
import * as actions from "./actions";

export type Actions = ActionType<typeof actions>;

export type State = {
    num: number;
    value: number;
};

const initialState = {
    num: 1,
    value: MIN_BET_VALUE,
};

function updateNum(state: State, num: number) {
    if (num !== 0 && num !== 1) {
        return state;
    }

    const maxBetValue = maxBet(GameType.FLIP_A_COIN, num, MIN_BANKROLL);
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
