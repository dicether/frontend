import * as Sentry from "@sentry/react";
import {applyMiddleware, createStore, compose, Middleware} from "redux";
import {createLogger} from "redux-logger";
import createSentryMiddleware from "redux-sentry-middleware";
import thunkMiddleware from "redux-thunk";
import {VERSION} from "./config/config";
import rootReducer, {State} from "./rootReducer";
import {truncate} from "./util/util";

const middlewares: Middleware[] = [thunkMiddleware];

function filterState(state: State) {
    // remove chat, bets, account from state
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                const response = hint?.xhr?.response;
                const truncatedResponse = response !== undefined ? truncate(response, 100) : undefined;
                breadcrumb.data = {...breadcrumb.data, response: truncatedResponse};
            }
            return breadcrumb;
        },
    });
}

if (process.env.REDUX_LOGGING) {
    middlewares.push(createLogger());
}

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
    // Optionally pass options listed below
});

export const store = createStore(rootReducer, compose(applyMiddleware(...middlewares)));
