import {Web3} from "web3";

import * as actions from "./actions";
import * as types from "./constants";
import {ActionType, assertNever} from "../../../util/util";

export type Actions = ActionType<typeof actions>;

export interface State {
    web3: Web3 | null;
    account: string | null;
    chainId: number | null;
    contract: any | null;
    balance: number | null;
}

const initialState = {
    web3: null,
    account: null,
    chainId: null,
    contract: null,
    balance: null,
};

export default function reducer(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case types.CHANGE_WEB3:
            return {...state, web3: action.web3};
        case types.CHANGE_ACCOUNT:
            return {...state, account: action.account};
        case types.CHANGE_NETWORK:
            return {...state, chainId: action.chainId};
        case types.CHANGE_CONTRACT:
            return {...state, contract: action.contract};
        case types.CHANGE_BALANCE:
            return {...state, balance: action.balance};
        default:
            assertNever(action);
            return state;
    }
}
