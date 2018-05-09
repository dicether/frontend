import {combineReducers, Reducer} from 'redux'

import account, {State as AccountState} from './platform/modules/account/reducer'
import chat, {State as ChatState} from './platform/modules/chat/reducer'
import web3, {State as Web3State} from './platform/modules/web3/reducer'
import app, {State as AppState} from './platform/modules/utilities/reducer'
import friend, {State as FriendState} from './platform/modules/friends/reducer';
import bets, {State as BetsState} from './platform/modules/bets/reducer';
import games, {State as GamesState} from './platform/modules/games/reducer';

export type State = {
    account: AccountState,
    chat: ChatState,
    friend: FriendState,
    web3: Web3State,
    app: AppState,
    games: GamesState,
    bets: BetsState
}

const appReducer: Reducer<State> = combineReducers({
    account,
    chat,
    friend,
    web3,
    app,
    games,
    bets
});

function rootReducer(state: State, action: any): State {
    if (action.type === 'USER_LOGOUT') {
        (state as any) = undefined
    }

    return appReducer(state, action);
}

export default rootReducer;
