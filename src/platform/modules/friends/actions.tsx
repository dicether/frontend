import * as types from "./constants";
import {Friend, FriendRequest} from "./types";
import {ActionCreateType} from "../../../util/util";

const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;

export const changeFriends = ca((friends: Friend[]) => {
    return {type: types.CHANGE_FRIENDS, friends};
});

export const addFriendS = ca((friend: Friend) => {
    return {type: types.ADD_FRIEND, friend};
});

export const changeReceivedFriendRequests = ca((receivedFriendRequests: FriendRequest[]) => {
    return {type: types.CHANGE_RECEIVED_FRIEND_REQUESTS, receivedFriendRequests};
});

export const addReceivedFriendRequest = ca((receivedFriendRequest: FriendRequest) => {
    return {type: types.ADD_RECEIVED_FRIEND_REQUEST, receivedFriendRequest};
});

export const changeSentFriendRequests = ca((sentFriendRequests: FriendRequest[]) => {
    return {type: types.CHANGE_SENT_FRIEND_REQUESTS, sentFriendRequests};
});

export const addSentFriendRequest = ca((sentFriendRequest: FriendRequest) => {
    return {type: types.ADD_SENT_FRIEND_REQUEST, sentFriendRequest};
});

export const removeReceivedFriendRequest = ca((address: string) => {
    return {type: types.REMOVE_RECEIVED_FRIEND_REQUEST, address};
});

export const removeSentFriendRequest = ca((address: string) => {
    return {type: types.REMOVE_SENT_FRIEND_REQUEST, address};
});

export const toggleFriendOnline = ca((address: string, online: boolean) => {
    return {type: types.TOGGLE_FRIEND_ONLINE, status: {address, online}};
});
