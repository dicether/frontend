import {createConstant} from '../../../util/util';


function c<T>(p: T): T {
    return createConstant(p, 'chat/friends');
}

export const TOGGLE_CHAT = c('TOGGLE_CHAT');
export const CHANGE_MESSAGES = c('CHANGE_MESSAGES');
export const ADD_MESSAGE = c('ADD_MESSAGE');
export const DELETE_MESSAGE = c('DELETE_MESSAGE');
export const CHANGE_USERS_ONLINE = c('CHANGE_USERS_ONLINE');
