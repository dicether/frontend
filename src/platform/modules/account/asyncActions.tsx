import axios from "axios";
import jwtDecode from 'jwt-decode';

import {Dispatch, GetState, isLocalStorageAvailable} from "../../../util/util";
import {showErrorMessage} from "../utilities/actions";
import {REALM} from "../../../config/config";
import {signTypedData} from "../web3/asyncActions";
import {catchError} from "../utilities/asyncActions";
import {changeFirstVisitedS, changeJWTS, changeMyGameSessions, changeMyStats} from "./actions";
import {SOCKET} from "../../../config/sockets";
import {loadMyBets} from "../bets/asyncActions";
import {loadFriendRequests, loadFriends} from "../friends/asyncActions";
import {loadMessages} from "../chat/asyncActions";
import {User} from "./types";
import {changeAxiosAuthToken} from "../../../config/apiEndpoints";

export function changeFirstVisited(firstVisited: boolean) {
    return function (dispatch: Dispatch) {
        if (isLocalStorageAvailable()) {
            localStorage.setItem('visited', String(firstVisited));
        }
        dispatch(changeFirstVisitedS(firstVisited));
    }
}

export function changeJWT(jwt: string | null) {
    return function (dispatch: Dispatch) {
        changeAxiosAuthToken(jwt);
        if (jwt === null) {
            sessionStorage.removeItem('jwt');
        } else {
            sessionStorage.setItem('jwt', jwt);
        }
        dispatch(changeJWTS(jwt));
    }
}

export function authenticateSocket() {
    return function (dispatch: Dispatch, getState: GetState) {
        const jwt = getState().account.jwt;
        if (jwt !== null) {
            SOCKET.emit('authenticate', jwt);
        }
    }
}

export function deAuthenticateSocket() {
    return function (dispatch: Dispatch, getState: GetState) {
        const jwt = getState().account.jwt;
        if (jwt !== null) {
            SOCKET.emit('deauthenticate', jwt);
        }
    }
}

export function authenticate() {
    return function (dispatch: Dispatch, getState: GetState) {
        const web3State = getState().web3;
        const web3 = web3State.web3;
        const web3Account = web3State.account;
        if (web3 === null || web3Account === null) {
            dispatch(showErrorMessage("Error: You need metamask/mist to authenticate!"));
            return undefined;
        }

        let nonce = '';
        return axios.post('authenticationNonce', {
            address: web3Account
        }).then(response => {
            nonce = response.data.nonce;
            const typedData = [
                {
                    type: 'string',
                    name: 'Realm',
                    value: REALM
                },
                {
                    type: 'address',
                    name: 'Account Address',
                    value: web3Account
                },
                {
                    type: 'uint64',
                    name: 'Nonce',
                    value: response.data.nonce
                }
            ];

            return signTypedData(web3, web3Account, typedData);
        }).then(result => {
            return axios.post('authenticate', {
                realm: REALM,
                address: web3Account,
                nonce,
                signature: result
            });
        }).then(response => {
                initUser(dispatch, response.data.jwt);
        }).catch(error => catchError(error, dispatch));
    }
}

export function register(username: string) {
    return function (dispatch: Dispatch, getState: GetState) {
        const web3State = getState().web3;
        const web3 = web3State.web3;
        const web3Account = web3State.account;
        if (web3 === null || web3Account === null) {
            dispatch(showErrorMessage("Error: You need Metamask or similar to register!"));
            return undefined;
        }

        const typedData = [
            {
                type: 'string',
                name: 'Realm',
                value: REALM
            },
            {
                type: 'address',
                name: 'Account Address',
                value: web3Account
            },
            {
                type: 'string',
                name: 'Username',
                value: username
            }
        ];

        return signTypedData(web3, web3Account, typedData).then(result => {
            return axios.post('register', {
                realm: REALM,
                address: web3Account,
                username,
                signature: result,
            });
        }).then(response => {
                initUser(dispatch, response.data.jwt);
            }
        ).catch(error => catchError(error, dispatch));
    };
}

export function deauthenticate() {
    return function (dispatch: Dispatch, getState: GetState) {
        if (getState().account.jwt !== null) {
            dispatch(changeJWT(null));
            dispatch({type: 'USER_LOGOUT'});
            dispatch(deAuthenticateSocket());
            loadDefaultData(dispatch);

        }
    }
}

export function loadStats(address: string) {
    return function (dispatch: Dispatch) {
        return axios.get(`userStats/${address}`).then(
            result => dispatch(changeMyStats(result.data))
        ).catch(
            error => catchError(error, dispatch)
        )
    }
}

export function loadGameSessions(address: string) {
    return function (dispatch: Dispatch) {
        return axios.get(`userGameSessions/${address}`).then(
            result => dispatch(changeMyGameSessions(result.data))
        ).catch(
            error => catchError(error, dispatch)
        )
    }
}

export function initUser(dispatch: Dispatch, jwt: string) {
    const address = jwtDecode<User>(jwt).address;
    dispatch(changeJWT(jwt));
    dispatch(loadStats(address)).catch(console.log);
    dispatch(loadGameSessions(address)).catch(console.log);
    dispatch(loadMyBets(address));
    dispatch(loadFriends(address)).catch(console.log);
    dispatch(loadFriendRequests(address)).catch(console.log);
    dispatch(authenticateSocket());
}

export function loadDefaultData(dispatch: Dispatch) {
    dispatch(loadMessages());
    SOCKET.emit('getUsersOnline');
}
