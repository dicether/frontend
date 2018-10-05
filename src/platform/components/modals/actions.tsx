import { show } from 'redux-modal'

import {Dispatch, GetState} from "../../../util/util";


export function showMissingWalletModal() {
    return show("missingWallet");
}

function showRegisterModalInternal() {
    return show("register");
}

export function showRegisterModal() {
    return function(dispatch: Dispatch, getState: GetState) {
        if (!getState().web3.web3) {
            dispatch(showMissingWalletModal());
        } else {
            dispatch(showRegisterModalInternal());
        }
    }
}