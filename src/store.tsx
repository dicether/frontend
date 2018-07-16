import {applyMiddleware, createStore, Middleware} from "redux";
import rootReducer, {State} from "./rootReducer";
import thunkMiddleware from "redux-thunk";
import createRavenMiddleware from "raven-for-redux";
import {createLogger} from "redux-logger";
import Raven from "raven-js";

const middlewares: Array<Middleware> = [
    thunkMiddleware
];

function filterState(state: State) {
    // remove chat, bets, account from state
    const {chat, bets, account, web3, ...newState} = state;

    // remove hashChain from state
    return {...newState, games: {...newState.games, gameState: {...newState.games.gameState, hashChain: undefined}}};
}

if (process.env.SENTRY_LOGGING) {
    Raven.config('https://551f6a44d9a54cfe9c18e976685f8234@sentry.io/227657').install();
    middlewares.push(createRavenMiddleware(Raven, {
        stateTransformer: filterState
    }));
}

if (process.env.REDUX_LOGGING) {
    middlewares.push(createLogger());
}


export const store = createStore(
    rootReducer,
    applyMiddleware(
        ...middlewares
    )
);
