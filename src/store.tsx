import createRavenMiddleware from "raven-for-redux";
import Raven from "raven-js";
import {applyMiddleware, createStore, Middleware} from "redux";
import {createLogger} from "redux-logger";
import thunkMiddleware from "redux-thunk";
import rootReducer, {State} from "./rootReducer";

const middlewares: Middleware[] = [thunkMiddleware];

function filterState(state: State) {
    // remove chat, bets, account from state
    const {chat, bets, account, web3, ...newState} = state;

    // remove hashChain from state
    return {
        ...newState,
        games: {...newState.games, gameState: {...newState.games.gameState, hashChain: undefined}},
    };
}

function filterAction(action: any) {
    // Remove data from action
    const {type} = action;
    return {type};
}

if (process.env.SENTRY_LOGGING) {
    Raven.config("https://551f6a44d9a54cfe9c18e976685f8234@sentry.io/227657").install();
    middlewares.push(
        createRavenMiddleware(Raven, {
            stateTransformer: filterState,
            actionTransformer: filterAction,
            debug: true,
        })
    );
}

if (process.env.REDUX_LOGGING) {
    middlewares.push(createLogger());
}

export const store = createStore(rootReducer, applyMiddleware(...middlewares));
