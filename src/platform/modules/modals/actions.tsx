import {hide, show} from "redux-modal";

import {Dispatch, GetState} from "../../../util/util";
import {User} from "../account/types";
import {Bet} from "../bets/types";

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

export function showBetModal({bet, betId}: {bet?: Bet; betId?: number}) {
    return show("bet", {bet, betId});
}

export function hideBetModal() {
    hide("bet");
}

export function showUserModal({user, userName}: {user?: User; userName?: string}) {
    return show("user", {user, userName});
}

export function hideUserModal() {
    hide("user");
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
