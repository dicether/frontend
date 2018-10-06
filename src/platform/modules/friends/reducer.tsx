import * as types from "./constants";

import {ActionType, assertNever} from "../../../util/util";
import * as actions from "./actions";
import {Friend, FriendRequest} from "./types";

export type Actions = ActionType<typeof actions>;

export type State = {
    readonly friends: Friend[];
    readonly sentFriendRequests: FriendRequest[];
    readonly receivedFriendRequests: FriendRequest[];
};

export const initialState: State = {
    friends: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
};

function updateFriendStatus(friend: Friend, online: boolean) {
    return {...friend, online};
}

export default function(state: State = initialState, action: Actions) {
    switch (action.type) {
        case types.CHANGE_FRIENDS:
            return {...state, friends: action.friends};
        case types.ADD_FRIEND:
            return {...state, friends: [...state.friends, action.friend]};
        case types.CHANGE_RECEIVED_FRIEND_REQUESTS:
            return {...state, receivedFriendRequests: action.receivedFriendRequests};
        case types.ADD_RECEIVED_FRIEND_REQUEST:
            return {
                ...state,
                receivedFriendRequests: [...state.receivedFriendRequests, action.receivedFriendRequest],
            };
        case types.REMOVE_RECEIVED_FRIEND_REQUEST: {
            const address = action.address;
            return {
                ...state,
                receivedFriendRequests: state.receivedFriendRequests.filter(
                    friendReq => friendReq.from.address !== address
                ),
            };
        }
        case types.CHANGE_SENT_FRIEND_REQUESTS:
            return {...state, sentFriendRequests: action.sentFriendRequests};
        case types.ADD_SENT_FRIEND_REQUEST:
            return {...state, sentFriendRequests: [...state.sentFriendRequests, action.sentFriendRequest]};
        case types.REMOVE_SENT_FRIEND_REQUEST: {
            const address = action.address;
            return {
                ...state,
                sentFriendRequests: state.sentFriendRequests.filter(friendReq => friendReq.to.address !== address),
            };
        }
        case types.TOGGLE_FRIEND_ONLINE: {
            const status = action.status;
            return {
                ...state,
                friends: state.friends.map(
                    friend =>
                        status.address === friend.user.address ? updateFriendStatus(friend, status.online) : friend
                ),
            };
        }
        default:
            assertNever(action);
            return state;
    }
}
