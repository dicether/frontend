import {SOCKET} from "../config/sockets";
import {Dispatch} from "../util/util";
import betSocketListener from "./modules/bets/socketListeners";
import chatSocketListener from "./modules/chat/socketListeners";
import friendSocketListener from "./modules/friends/socketListeners";

const defaultListeners = {...betSocketListener, ...friendSocketListener, ...chatSocketListener};

type ListenersType = {[id: string]: (dispatch: Dispatch) => (...args: any[]) => void};

export function addListeners(listeners: ListenersType, dispatch: Dispatch) {
    for (const event of Object.keys(listeners)) {
        SOCKET.on(event, listeners[event](dispatch));
    }
}

export function removeListeners(listeners: ListenersType, _dispatch: Dispatch) {
    for (const event of Object.keys(listeners)) {
        SOCKET.removeListener(event);
    }
}

function addDefaultListeners(dispatch: Dispatch) {
    addListeners(defaultListeners, dispatch);
}

function removeDefaultListeners(dispatch: Dispatch) {
    removeListeners(defaultListeners, dispatch);
}

export function init(dispatch: Dispatch) {
    addDefaultListeners(dispatch);
}

export function unInit(dispatch: Dispatch) {
    removeDefaultListeners(dispatch);
}

export function reInit(dispatch: Dispatch) {
    removeDefaultListeners(dispatch);
    addDefaultListeners(dispatch);
}
