import {ActionType, assertNever, fixedLengthAddElement} from "../../../util/util";
import * as types from "./constants";

import * as actions from "./actions";
import {Message} from "./types";

export type Actions = ActionType<typeof actions>;

export type State = {
    readonly show: boolean;
    readonly messages: Message[];
    readonly numUsers: number;
};

const initialState: State = {
    show: window.innerWidth >= 992,
    messages: [],
    numUsers: 0,
};

const MAX_MESSAGES = 50;

export default function chat(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case types.TOGGLE_CHAT:
            return {...state, show: action.show};
        case types.CHANGE_MESSAGES:
            return {...state, messages: action.messages};
        case types.ADD_MESSAGE:
            return {...state, messages: fixedLengthAddElement(state.messages, action.message, MAX_MESSAGES)};
        case types.CHANGE_USERS_ONLINE:
            return {...state, numUsers: action.numUsers};
        case types.DELETE_MESSAGE:
            return {
                ...state,
                messages: state.messages.map(m => (m.id === action.messageId ? {...m, deleted: true} : m)),
            };
        default:
            assertNever(action);
            return state;
    }
}
