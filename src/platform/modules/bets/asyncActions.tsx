import axios from "axios";

import {Dispatch, GetState} from "../../../util/util";
import {catchError} from "../utilities/asyncActions";
import {addBet, addMyBet, changeBets, changeMyBets} from "./actions";
import {Bet} from "./types";
import {getUser} from "../account/selectors";


export function loadBets() {
    return function (dispatch: Dispatch) {
        axios.get('/bets/lastBets').then(response => {
            const bets = response.data.bets;
            return dispatch(changeBets(bets));
        }).catch(error => {
            catchError(error, dispatch);
        });
    }
}

export function loadMyBets(address: string) {
    return function (dispatch: Dispatch) {
        axios.get(`/bets/myLastBets`).then(response => {
            const myBets = response.data.bets;
            return dispatch(changeMyBets(myBets));
        }).catch(error => {
            catchError(error, dispatch);
        });
    }
}

export function addNewBet(bet: Bet) {
    return function (dispatch: Dispatch, getState: GetState) {
        const state = getState();
        const user = getUser(getState());
        const bets = state.bets.allBets;

        if (bets.length > 0 && bet.id !== bets[0].id + 1) {
            // we missed some bets => reload bets
            dispatch(loadBets());
        } else {
            dispatch(addBet(bet));
        }

        if (user !== null && user.address === bet.user.address) {
            dispatch(addMyBet(bet));
        }
    }
}
