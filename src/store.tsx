import * as Sentry from "@sentry/browser";
import {applyMiddleware, createStore, Middleware} from "redux";
import {createLogger} from "redux-logger";
import createSentryMiddleware from "redux-sentry-middleware";
import thunkMiddleware from "redux-thunk";
import {VERSION} from "./config/config";
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
    const type = action?.type;
    return {type};
}

if (process.env.SENTRY_LOGGING) {
    Sentry.init({
        dsn: "https://551f6a44d9a54cfe9c18e976685f8234@sentry.io/227657",
        release: `dicether@${VERSION}`,
        normalizeDepth: 10,
        maxBreadcrumbs: 20,
        beforeBreadcrumb(breadcrumb, hint) {
            if (breadcrumb.category === "xhr") {
                breadcrumb.data = {xhr: hint?.xhr};
            }
            return breadcrumb;
        },
    });
    middlewares.push(
        createSentryMiddleware(Sentry, {
            stateTransformer: filterState,
            actionTransformer: filterAction,
        })
    );
}

if (process.env.REDUX_LOGGING) {
    middlewares.push(createLogger());
}

export const store = createStore(rootReducer, applyMiddleware(...middlewares));
