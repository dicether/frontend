import * as types from "./constants";
import {Bet} from "./types";
import {ActionCreateType} from "../../../util/util";

const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;

export const changeBets = ca((bets: Bet[]) => {
    return {type: types.CHANGE_BETS, bets};
});

export const addBet = ca((bet: Bet) => {
    return {type: types.ADD_BET, bet};
});

export const changeMyBets = ca((myBets: Bet[]) => {
    return {type: types.CHANGE_MY_BETS, myBets};
});

export const addMyBet = ca((myBet: Bet) => {
    return {type: types.ADD_MY_BET, myBet};
});
