import * as Sentry from "@sentry/react";
import {Middleware, StoreEnhancer} from "redux";
import {createLogger} from "redux-logger";
import {configureStore} from "@reduxjs/toolkit";
import {VERSION} from "./config/config";
import rootReducer, {State} from "./rootReducer";
import {truncate} from "./util/util";

const middlewares: Middleware[] = []; // = [thunkMiddleware];
const enhancers: StoreEnhancer[] = [];

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
        dsn: "https://551f6a44d9a54cfe9c18e976685f8234@o103499.ingest.sentry.io/227657",
        tunnel: "/sentry",
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

    const sentryReduxEnhancer = Sentry.createReduxEnhancer({
        actionTransformer: filterAction,
        stateTransformer: filterState,
    });
    enhancers.push(sentryReduxEnhancer);
}

if (process.env.REDUX_LOGGING) {
    const logger = createLogger();
    middlewares.push(logger as Middleware);
}

export const store = configureStore({
    reducer: rootReducer,
    // TODO: remove web3, contract from store
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: {
                // Ignore these field paths in all actions
                ignoredActionPaths: ["contract", "web3"],
                // Ignore these paths in the state
                ignoredPaths: ["web3.web3", "web3.contract"],
            },
        }).concat(middlewares),
    enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(enhancers),
});
