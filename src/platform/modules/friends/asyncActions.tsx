import {Dispatch} from "../../../util/util";
import axios from "axios";
import {catchError} from "../utilities/asyncActions";
import {
    addFriendS, addSentFriendRequest, changeFriends, changeReceivedFriendRequests, changeSentFriendRequests,
    removeReceivedFriendRequest, removeSentFriendRequest
} from "./actions";
import {Friend} from "./types";


export function sendFriendRequest(address: string) {
    return function (dispatch: Dispatch) {
        return axios.post('/chat/sendFriendRequest', {
            address
        }).then(
            response => dispatch(addSentFriendRequest(response.data))
        ).catch(error => catchError(error, dispatch));
    }
}

export function declineFriendRequest(address: string) {
    return function (dispatch: Dispatch) {
        return axios.post('/chat/declineFriendRequest', {
                address
            }
        ).then(
            response => dispatch(removeReceivedFriendRequest(address))
        ).catch(error => catchError(error, dispatch));
    }
}

export function addFriend(friend: Friend) {
    return function (dispatch: Dispatch) {
        dispatch(removeReceivedFriendRequest(friend.user.address));
        dispatch(removeSentFriendRequest(friend.user.address));
        dispatch(addFriendS(friend));
    }
}

export function declinedFriendRequest(address: string) {
    return function (dispatch: Dispatch) {
        dispatch(removeSentFriendRequest(address));
    }
}

export function cancelFriendRequest(address: string) {
    return function (dispatch: Dispatch) {
        return axios.post('/chat/cancelFriendRequest', {
                address
            }
        ).then(
            response => dispatch(removeSentFriendRequest(address))
        ).catch(error => catchError(error, dispatch));
    }
}

export function acceptFriendRequest(address: string) {
    return function (dispatch: Dispatch) {
        return axios.post('/chat/acceptFriendRequest', {
                address
            }
        ).then(response => {
            dispatch(addFriend(response.data));
            dispatch(removeReceivedFriendRequest(address));
        }).catch(error => catchError(error, dispatch));
    }
}

export function loadFriendRequests(address: string) {
    return function (dispatch: Dispatch) {
        return axios.get('/chat/friendRequests').then(response => {
            const data = response.data;
            dispatch(changeSentFriendRequests(data.sentFriendRequests));
            dispatch(changeReceivedFriendRequests(data.receivedFriendRequests));
        }).catch(error => catchError(error, dispatch));

    }
}

export function loadFriends(address: string) {
    return function (dispatch: Dispatch) {
        return axios.get('/chat/friends').then(
            response => dispatch(changeFriends(response.data))
        ).catch(error => catchError(error, dispatch));
    }
}
