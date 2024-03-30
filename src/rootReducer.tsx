import {combineReducers} from "redux";

import account, {State as AccountState} from "./platform/modules/account/reducer";
import bets, {State as BetsState} from "./platform/modules/bets/reducer";
import chat, {State as ChatState} from "./platform/modules/chat/reducer";
import friend, {State as FriendState} from "./platform/modules/friends/reducer";
import games, {State as GamesState} from "./platform/modules/games/reducer";
import app, {State as AppState} from "./platform/modules/utilities/reducer";
import web3, {State as Web3State} from "./platform/modules/web3/reducer";
import modal, {ModalState} from "./platform/modules/modals/slice";

export type State = {
    account: AccountState;
    chat: ChatState;
    friend: FriendState;
    web3: Web3State;
    app: AppState;
    games: GamesState;
    bets: BetsState;
    modal: ModalState;
};

const appReducer = combineReducers({
    account,
    chat,
    friend,
    web3,
    app,
    games,
    bets,
    modal,
});

function rootReducer(state: State | undefined, action: any): State {
    if (action.type === "USER_LOGOUT") {
        (state as any) = undefined;
    }

    return appReducer(state, action);
}

export default rootReducer;
