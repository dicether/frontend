import axios from "axios";
import jwtDecode from "jwt-decode";
import Raven from "raven-js";

import {changeAxiosAuthToken} from "../../../config/apiEndpoints";
import {REALM} from "../../../config/config";
import {SOCKET} from "../../../config/sockets";
import {Dispatch, GetState, isLocalStorageAvailable} from "../../../util/util";
import {loadBets, loadMyBets} from "../bets/asyncActions";
import {loadMessages} from "../chat/asyncActions";
import {loadFriendRequests, loadFriends} from "../friends/asyncActions";
import {hideRegisterModal, showMissingWalletModal} from "../modals/actions";
import {showErrorMessage} from "../utilities/actions";
import {catchError} from "../utilities/asyncActions";
import {requestAccounts, signTypedData} from "../web3/asyncActions";
import {changeFirstVisitedS, changeJWTS, changeMyGameSessions, changeMyStats} from "./actions";
import {User} from "./types";

const authenticateTypes = {
    EIP712Domain: [{name: "name", type: "string"}],
    Authenticate: [{name: "address", type: "address"}, {name: "nonce", type: "uint64"}],
};

const registerTypes = {
    EIP712Domain: [{name: "name", type: "string"}],
    Register: [{name: "address", type: "address"}, {name: "username", type: "string"}],
};

export function changeFirstVisited(firstVisited: boolean) {
    return (dispatch: Dispatch) => {
        if (isLocalStorageAvailable()) {
            localStorage.setItem("visited", String(firstVisited));
        }
        dispatch(changeFirstVisitedS(firstVisited));
    };
}

export function changeJWT(jwt: string | null) {
    return (dispatch: Dispatch) => {
        changeAxiosAuthToken(jwt);
        if (jwt === null) {
            sessionStorage.removeItem("jwt");
        } else {
            sessionStorage.setItem("jwt", jwt);
        }
        dispatch(changeJWTS(jwt));
    };
}

export function authenticateSocket() {
    return (dispatch: Dispatch, getState: GetState) => {
        const jwt = getState().account.jwt;
        if (jwt !== null) {
            SOCKET.emit("authenticate", jwt);
        }
    };
}

export function deAuthenticateSocket() {
    return (dispatch: Dispatch, getState: GetState) => {
        const jwt = getState().account.jwt;
        if (jwt !== null) {
            SOCKET.emit("deauthenticate", jwt);
        }
    };
}

export function authenticate() {
    return async (dispatch: Dispatch, getState: GetState) => {
        const web3State = getState().web3;
        const web3 = web3State.web3;
        if (web3 === null) {
            dispatch(showMissingWalletModal());
            return undefined;
        }

        if (web3State.account === null) {
            await requestAccounts(dispatch);
        }
        const web3Account = getState().web3.account;
        if (web3Account === null) {
            dispatch(showErrorMessage("Error: You need to log in to your web3 wallet!!"));
            return;
        }

        let nonce = "";
        return axios
            .post("/auth/authenticationNonce", {
                address: web3Account,
            })
            .then(response => {
                nonce = response.data.nonce;
                const typedData = {
                    types: authenticateTypes,
                    primaryType: "Authenticate",
                    domain: {name: REALM},
                    message: {address: web3Account, nonce},
                };

                return signTypedData(web3, web3Account, typedData);
            })
            .then(result => {
                return axios.post("/auth/authenticate", {
                    realm: REALM,
                    address: web3Account,
                    nonce,
                    signature: result,
                });
            })
            .then(response => {
                dispatch(hideRegisterModal());
                initUser(dispatch, response.data.jwt);
            })
            .catch(error => catchError(error, dispatch));
    };
}

export function register(username: string) {
    return async (dispatch: Dispatch, getState: GetState) => {
        const web3State = getState().web3;
        const web3 = web3State.web3;

        if (web3 === null) {
            dispatch(showMissingWalletModal());
            return undefined;
        }

        if (web3State.account === null) {
            await requestAccounts(dispatch);
        }
        const web3Account = getState().web3.account;
        if (web3Account === null) {
            dispatch(showErrorMessage("Error: You need to log in to your web3 wallet!!"));
            return;
        }

        const typedData = {
            types: registerTypes,
            primaryType: "Register",
            domain: {name: REALM},
            message: {address: web3Account, username},
        };

        const referredBy = localStorage.getItem("referral");

        return signTypedData(web3, web3Account, typedData)
            .then(result => {
                return axios.post("/auth/register", {
                    realm: REALM,
                    address: web3Account,
                    username,
                    signature: result,
                    referredBy: referredBy ? referredBy : undefined,
                });
            })
            .then(response => {
                dispatch(hideRegisterModal());
                initUser(dispatch, response.data.jwt);
            })
            .catch(error => catchError(error, dispatch));
    };
}

export function deauthenticate() {
    return (dispatch: Dispatch, getState: GetState) => {
        if (getState().account.jwt !== null) {
            dispatch(changeJWT(null));
            dispatch({type: "USER_LOGOUT"});
            dispatch(deAuthenticateSocket());
            loadDefaultData(dispatch);
            Raven.setUserContext();
        }
    };
}

export function loadStats(address: string) {
    return (dispatch: Dispatch) => {
        return axios
            .get(`/stats/user/${address}`)
            .then(result => dispatch(changeMyStats(result.data)))
            .catch(error => catchError(error, dispatch));
    };
}

export function loadGameSessions(address: string) {
    return (dispatch: Dispatch) => {
        return axios
            .get(`/gameSessions/${address}`)
            .then(result => dispatch(changeMyGameSessions(result.data)))
            .catch(error => catchError(error, dispatch));
    };
}

export function initUser(dispatch: Dispatch, jwt: string) {
    const {address, username} = jwtDecode<User>(jwt);
    dispatch(changeJWT(jwt));
    dispatch(loadStats(address)).catch(console.log);
    dispatch(loadGameSessions(address)).catch(console.log);
    dispatch(loadMyBets(address));
    dispatch(loadFriends(address)).catch(console.log);
    dispatch(loadFriendRequests(address)).catch(console.log);
    dispatch(authenticateSocket());
    Raven.setUserContext({
        username,
        address,
    });
}

export function loadDefaultData(dispatch: Dispatch) {
    dispatch(loadBets());
    dispatch(loadMessages());
    SOCKET.emit("getUsersOnline");
}
