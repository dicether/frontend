import {GameType, getNumSetBits, KENO_FIELDS, KENO_SELECTABLE_FIELDS, maxBet} from "@dicether/state-channel";
import BN from "bn.js";

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
    num: 0,
    value: MIN_BET_VALUE,
};

function updateNum(state: State, num: number) {
    const numSelectedTiles = getNumSetBits(num);
    const maxNum = new BN(1).shln(KENO_FIELDS).toNumber();
    if (num < 0 || num >= maxNum || numSelectedTiles > KENO_SELECTABLE_FIELDS) {
        return state;
    }

    let value = state.value;
    if (num !== 0) {
        const maxBetValue = maxBet(GameType.KENO, num, MIN_BANKROLL, KELLY_FACTOR);
        value = Math.min(maxBetValue, state.value);
    }

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
