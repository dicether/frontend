import {Dispatch} from "../../../util/util";
import {changeUsersOnline} from "./actions";
import {Message} from "./types";
import {addNewMessage} from "./asyncActions";

const listeners = {
    usersOnline: (dispatch: Dispatch) => (numUsers: {numUsers: number}) => {
        dispatch(changeUsersOnline(numUsers.numUsers));
    },
    message: (dispatch: Dispatch) => (message: Message) => {
      dispatch(addNewMessage(message));
    }
};

export default listeners;
