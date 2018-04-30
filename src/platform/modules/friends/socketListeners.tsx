import {Dispatch} from "../../../util/util";
import {addFriend, declinedFriendRequest} from "./asyncActions";
import {Friend, FriendRequest} from "./types";
import {addReceivedFriendRequest, removeReceivedFriendRequest, toggleFriendOnline} from "./actions";


const listeners = {
    addFriend: (dispatch: Dispatch) => (friend: Friend) => {
        dispatch(addFriend(friend));
    },
    friendRequest: (dispatch: Dispatch) => (friendRequest: FriendRequest) => {
      dispatch(addReceivedFriendRequest(friendRequest));
    },
    declineFriendRequest: (dispatch: Dispatch) => (address: string) => {
        dispatch(declinedFriendRequest(address));
    },
    cancelFriendRequest: (dispatch: Dispatch) => (address: string) => {
      dispatch(removeReceivedFriendRequest(address));
    },
    toggleFriendOnline: (dispatch: Dispatch) => (address: string, online: boolean) => {
        dispatch(toggleFriendOnline(address, online));
    }
};

export default listeners;
