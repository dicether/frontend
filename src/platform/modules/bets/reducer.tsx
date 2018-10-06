import * as types from "./constants";

import {ActionType, assertNever, fixedLengthAddElementFront} from "../../../util/util";
import * as actions from "./actions";
import {Bet} from "./types";

export type Actions = ActionType<typeof actions>;

export type State = {
    allBets: Bet[];
    myBets: Bet[];
};

const initialState = {
    allBets: [],
    myBets: [],
};

export default function games(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case types.CHANGE_BETS:
            return {...state, allBets: action.bets};
        case types.ADD_BET:
            return {...state, allBets: fixedLengthAddElementFront(state.allBets, action.bet, 20)};
        case types.CHANGE_MY_BETS:
            return {...state, myBets: action.myBets};
        case types.ADD_MY_BET:
            return {...state, myBets: fixedLengthAddElementFront(state.myBets, action.myBet, 20)};
        default:
            assertNever(action);
            return state;
    }
}
