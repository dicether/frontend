import * as types from './constants';

import Web3 from "web3";
import * as actions from "./actions";
import {ActionType, assertNever} from "../../../util/util";


export type Actions = ActionType<typeof actions>;

export type State = {
    web3: Web3|null,
    account: string|null,
    networkId: number|null,
    contract: any|null,
    balance: number|null
}

const initialState = {
    web3: null,
    account: null,
    networkId: null,
    contract: null,
    balance: null
};


export default function reducer(state: State = initialState, action : Actions): State {
    switch (action.type) {
        case types.CHANGE_WEB3:
            return Object.assign({}, state, {
                web3: action.web3
            });
        case types.CHANGE_ACCOUNT:
            return Object.assign({}, state, {
                account: action.account
            });
        case types.CHANGE_NETWORK:
            return Object.assign({}, state, {
               networkId: action.networkId
            });
        case types.CHANGE_CONTRACT:
            return {...state, contract: action.contract};
        case types.CHANGE_BALANCE:
            return {...state, balance: action.balance};
        default:
            assertNever(action);
            return state;
    }
}
