import * as types from './constants';

import {Friend, FriendRequest} from "./types";
import {ActionType, assertNever} from "../../../util/util";
import * as actions from "./actions";


export type Actions = ActionType<typeof actions>;


export type State = {
    readonly friends: Array<Friend>,
    readonly sentFriendRequests: Array<FriendRequest>,
    readonly receivedFriendRequests: Array<FriendRequest>
}

export const initialState : State = {
    friends: [],
    sentFriendRequests: [],
    receivedFriendRequests: []
};

function updateFriendStatus(friend: Friend, online: boolean) {
    return Object.assign({}, friend, {
        online
    });
}

export default function(state : State = initialState, action : Actions) {
    switch(action.type) {
        case types.CHANGE_FRIENDS:
            return Object.assign({}, state, {
                friends: action.friends
            });
        case types.ADD_FRIEND:
            return Object.assign({}, state, {
                friends: [...state.friends, action.friend]
            });
        case types.CHANGE_RECEIVED_FRIEND_REQUESTS:
            return Object.assign({}, state, {
                receivedFriendRequests: action.receivedFriendRequests
            });
        case types.ADD_RECEIVED_FRIEND_REQUEST:
            return Object.assign({}, state, {
                receivedFriendRequests: [...state.receivedFriendRequests, action.receivedFriendRequest]
            });
        case types.REMOVE_RECEIVED_FRIEND_REQUEST: {
            const address = action.address;
            return Object.assign({}, state, {
                receivedFriendRequests: state.receivedFriendRequests.filter(
                    friendReq => friendReq.from.address !== address
                )
            });
        }
        case types.CHANGE_SENT_FRIEND_REQUESTS:
            return Object.assign({}, state, {
                sentFriendRequests: action.sentFriendRequests
            });
        case types.ADD_SENT_FRIEND_REQUEST:
            return Object.assign({}, state, {
                sentFriendRequests: [...state.sentFriendRequests, action.sentFriendRequest]
            });
        case types.REMOVE_SENT_FRIEND_REQUEST: {
            const address = action.address;
            return Object.assign({}, state, {
                sentFriendRequests: state.sentFriendRequests.filter(
                    friendReq => friendReq.to.address !== address
                )
            });
        }
        case types.TOGGLE_FRIEND_ONLINE: {
            const status = action.status;
            return Object.assign({}, state, {
                friends: state.friends.map(
                    friend => (status.address === friend.user.address ? updateFriendStatus(friend, status.online) : friend)
                )
            });
        }
        default:
            assertNever(action);
            return state;
    }
}
