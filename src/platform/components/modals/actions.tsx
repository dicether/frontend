import {hide, show} from "redux-modal";

import {Dispatch, GetState} from "../../../util/util";

export function showMissingWalletModal() {
    return show("missingWallet");
}

export function hideMissingWalletModal() {
    return hide("missingWallet");
}

function showRegisterModalInternal() {
    return show("register");
}

export function hideRegisterModal() {
    return hide("register");
}

export function showRegisterModal() {
    return (dispatch: Dispatch, getState: GetState) => {
        if (!getState().web3.web3) {
            dispatch(showMissingWalletModal());
        } else {
            dispatch(showRegisterModalInternal());
        }
    };
}
