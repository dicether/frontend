import * as Sentry from "@sentry/browser";
import {connect, getConnection, getConnectors, getPublicClient, injected, signTypedData} from "@wagmi/core";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

import {changeFirstVisitedS, changeJWTS, changeMyGameSessions, changeMyStats} from "./actions";
import {User} from "./types";
import {changeAxiosAuthToken} from "../../../config/apiEndpoints";
import {REALM} from "../../../config/config";
import {SOCKET} from "../../../config/sockets";
import wagmiConfig from "../../../config/wagmiConfig";
import {Dispatch, GetState, isLocalStorageAvailable} from "../../../util/util";
import {loadBets, loadMyBets} from "../bets/asyncActions";
import {loadMessages} from "../chat/asyncActions";
import {loadFriendRequests, loadFriends} from "../friends/asyncActions";
import {hideRegisterModal, showMissingWalletModal} from "../modals/slice";
import {showErrorMessage} from "../utilities/actions";
import {catchError} from "../utilities/asyncActions";

const authenticateTypes = {
    EIP712Domain: [{name: "name", type: "string"}],
    Authenticate: [
        {name: "address", type: "address"},
        {name: "nonce", type: "uint64"},
    ],
} as const;

const registerTypes = {
    EIP712Domain: [{name: "name", type: "string"}],
    Register: [
        {name: "address", type: "address"},
        {name: "username", type: "string"},
    ],
} as const;

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
    SOCKET.emit("deauthenticate");
}

export function authenticate() {
    return async (dispatch: Dispatch) => {
        try {
            const publicClient = getPublicClient(wagmiConfig);
            if (!publicClient) {
                dispatch(showMissingWalletModal());
                return;
            }

            let connection = getConnection(wagmiConfig);
            if (!connection.isConnected) {
                await connect(wagmiConfig, {connector: injected()});
            }

            connection = getConnection(wagmiConfig);

            if (!connection.address) {
                dispatch(showErrorMessage("Error: You need to log in to your web3 wallet!!"));
                return;
            }

            const response = await axios.post("/auth/authenticationNonce", {
                address: connection.address,
            });

            const nonce = response.data.nonce;
            const typedData = {
                types: authenticateTypes,
                primaryType: "Authenticate",
                domain: {name: REALM},
                message: {address: connection.address, nonce},
            } as const;

            const signature = await signTypedData(wagmiConfig, typedData);

            const authResponse = await axios.post("/auth/authenticate", {
                realm: REALM,
                address: connection.address,
                nonce,
                signature,
            });

            dispatch(hideRegisterModal());
            initUser(dispatch, authResponse.data.jwt);
        } catch (error) {
            catchError(error, dispatch);
        }
    };
}

export function register(username: string) {
    return async (dispatch: Dispatch) => {
        try {
            const connectors = getConnectors(wagmiConfig);
            const provider = await connectors[0].getProvider();
            if (!provider) {
                dispatch(showMissingWalletModal());
                return;
            }

            let connection = getConnection(wagmiConfig);
            if (!connection.isConnected) {
                await connect(wagmiConfig, {connector: injected()});
            }

            connection = getConnection(wagmiConfig);

            if (!connection.address) {
                dispatch(showErrorMessage("Error: You need to log in to your web3 wallet!!"));
                return;
            }

            const typedData = {
                types: registerTypes,
                primaryType: "Register",
                domain: {name: REALM},
                message: {address: connection.address, username},
            } as const;

            const referredBy = localStorage.getItem("referral");

            const signature = await signTypedData(wagmiConfig, typedData);

            const response = await axios.post("/auth/register", {
                realm: REALM,
                address: connection.address,
                username,
                signature: signature,
                referredBy: referredBy ?? undefined,
            });

            dispatch(hideRegisterModal());
            initUser(dispatch, response.data.jwt);
        } catch (error) {
            catchError(error, dispatch);
        }
    };
}

export function deauthenticate() {
    return (dispatch: Dispatch, getState: GetState) => {
        if (getState().account.jwt !== null) {
            deAuthenticateSocket();
            dispatch(changeJWT(null));
            dispatch({type: "USER_LOGOUT"});
            loadDefaultData(dispatch);
            Sentry.getCurrentScope().setUser({});
        }
    };
}

export function loadStats(address: string) {
    return (dispatch: Dispatch) => {
        return axios
            .get(`/stats/user/${address}`)
            .then((result) => dispatch(changeMyStats(result.data)))
            .catch((error) => catchError(error, dispatch));
    };
}

export function loadGameSessions(address: string) {
    return (dispatch: Dispatch) => {
        return axios
            .get(`/gameSessions/${address}`)
            .then((result) => dispatch(changeMyGameSessions(result.data)))
            .catch((error) => catchError(error, dispatch));
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
    Sentry.getCurrentScope().setUser({
        username,
        address,
    });
}

export function loadDefaultData(dispatch: Dispatch) {
    dispatch(loadBets());
    dispatch(loadMessages());
    SOCKET.emit("getUsersOnline");
}
