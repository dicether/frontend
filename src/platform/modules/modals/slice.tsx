import {createSlice} from "@reduxjs/toolkit";
import {Dispatch, GetState} from "../../../util/util";
import {Bet} from "../bets/types";
import {User} from "../account/types";
import type {PayloadAction} from "@reduxjs/toolkit";

export interface ModalState {
    showMissingWalletModal: boolean;
    showRegisterModal: boolean;
    betModal: {
        showBetModal: boolean;
        betId?: number;
        bet?: Bet;
    };
    userModal: {
        showUserModal: boolean;
        userName?: string;
        user?: User;
    };
}

const initialState: ModalState = {
    showMissingWalletModal: false,
    showRegisterModal: false,
    betModal: {
        showBetModal: false,
    },
    userModal: {
        showUserModal: false,
    },
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        showMissingWalletModal(state) {
            state.showMissingWalletModal = true;
        },
        hideMissingWalletModal(state) {
            state.showMissingWalletModal = false;
        },
        showRegisterModalInternal(state) {
            state.showRegisterModal = true;
        },
        hideRegisterModal(state) {
            state.showRegisterModal = false;
        },
        showBetModal(state, action: PayloadAction<{bet?: Bet; betId?: number}>) {
            const {bet, betId} = action.payload;
            state.betModal.showBetModal = true;
            state.betModal.bet = bet;
            state.betModal.betId = betId;
        },
        hideBetModal(state) {
            state.betModal.showBetModal = false;
            state.betModal.bet = undefined;
            state.betModal.betId = undefined;
        },
        showUserModal(state, action: PayloadAction<{user?: User; userName?: string}>) {
            const {user, userName} = action.payload;
            state.userModal.showUserModal = true;
            state.userModal.user = user;
            state.userModal.userName = userName;
        },
        hideUserModal(state) {
            state.userModal.showUserModal = false;
            state.userModal.user = undefined;
            state.userModal.userName = undefined;
        },
    },
});

export const {
    showMissingWalletModal,
    hideMissingWalletModal,
    showRegisterModalInternal,
    hideRegisterModal,
    showBetModal,
    hideBetModal,
    showUserModal,
    hideUserModal,
} = modalSlice.actions;
export default modalSlice.reducer;

export function showRegisterModal() {
    return (dispatch: Dispatch, getState: GetState) => {
        if (!getState().web3.web3) {
            dispatch(showMissingWalletModal());
        } else {
            dispatch(showRegisterModalInternal());
        }
    };
}
