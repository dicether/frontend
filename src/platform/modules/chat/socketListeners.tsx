import {Dispatch} from "../../../util/util";
import {addMessage, changeUsersOnline} from "./actions";
import {Message} from "./types";

const listeners = {
    usersOnline: (dispatch: Dispatch) => (numUsers: {numUsers: number}) => {
        dispatch(changeUsersOnline(numUsers.numUsers));
    },
    message: (dispatch: Dispatch) => (message: Message) => {
      dispatch(addMessage(message));
    }
};

export default listeners;
