import {Dispatch} from "../../../util/util";
import axios from "axios";
import {catchError} from "../utilities/asyncActions";
import {changeMessages} from "./actions";


export function loadMessages() {
    return function (dispatch: Dispatch) {
        axios.get('messages').then(response => {
            const messages = response.data;
            dispatch(changeMessages(messages));
        }).catch(error => catchError(error, dispatch));
    }
}

export function sendMessage(message: string) {
    return function (dispatch: Dispatch) {
        axios.post('sendMessage', {
            message
        }).catch(error => catchError(error, dispatch));
    }
}

export function mute(address: string) {
    return function (dispatch: Dispatch) {
        axios.post('muteUser', {
            address
        }).catch(error => catchError(error, dispatch));
    }
}
