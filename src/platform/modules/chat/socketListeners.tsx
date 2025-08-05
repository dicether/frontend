import {changeUsersOnline, deleteMessage} from "./actions";
import {addNewMessage} from "./asyncActions";
import {Message} from "./types";
import {Dispatch} from "../../../util/util";

const listeners = {
    usersOnline: (dispatch: Dispatch) => (numUsers: {numUsers: number}) => {
        dispatch(changeUsersOnline(numUsers.numUsers));
    },
    message: (dispatch: Dispatch) => (message: Message) => {
        dispatch(addNewMessage(message));
    },
    deleteMessage: (dispatch: Dispatch) => (messageId: number) => {
        dispatch(deleteMessage(messageId));
    },
};

export default listeners;
