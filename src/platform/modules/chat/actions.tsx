import * as types from './constants'
import {Message} from './types'
import {ActionCreateType} from "../../../util/util";


const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;


export const toggleChat = ca((show: boolean) => {
    return {type: types.TOGGLE_CHAT, show};
});


export const changeMessages = ca((messages: Array<Message>) => {
    return {type: types.CHANGE_MESSAGES, messages};
});


export const addMessage = ca((message: Message) => {
    return {type: types.ADD_MESSAGE, message};
});


export const changeUsersOnline = ca((numUsers: number) => {
    return {type: types.CHANGE_USERS_ONLINE, numUsers};
});
