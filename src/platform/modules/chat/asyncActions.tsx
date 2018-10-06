import axios from "axios";
import {Dispatch, GetState} from "../../../util/util";
import {showSuccessMessage} from "../utilities/actions";
import {catchError} from "../utilities/asyncActions";
import {addMessage, changeMessages} from "./actions";
import {Message} from "./types";

export function loadMessages() {
    return (dispatch: Dispatch) => {
        axios
            .get("/chat/messages")
            .then(response => {
                const messages = response.data;
                dispatch(changeMessages(messages));
            })
            .catch(error => catchError(error, dispatch));
    };
}

export function sendMessage(message: string) {
    return (dispatch: Dispatch) => {
        axios
            .post("/chat/sendMessage", {
                message,
            })
            .catch(error => catchError(error, dispatch));
    };
}

export function mute(address: string) {
    return (dispatch: Dispatch) => {
        axios
            .post("/chat/muteUser", {
                address,
            })
            .then(() => {
                dispatch(showSuccessMessage("Muted player!"));
            })
            .catch(error => catchError(error, dispatch));
    };
}

export function deleteMessage(messageId: number) {
    return (dispatch: Dispatch) => {
        axios
            .post("/chat/deleteMessage", {
                messageId,
            })
            .catch(error => catchError(error, dispatch));
    };
}

export function addNewMessage(message: Message) {
    return (dispatch: Dispatch, getState: GetState) => {
        const messages = getState().chat.messages;
        if (messages.length > 0 && messages[messages.length - 1].id + 1 !== message.id) {
            dispatch(loadMessages());
        } else {
            // TODO: add notification!
            dispatch(addMessage(message));
        }
    };
}
