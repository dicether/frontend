import * as actions from "./actions";
import * as types from "./constants";
import {GameSession, Stats} from "./types";
import {ActionType, assertNever, isLocalStorageAvailable, isSessionStorageAvailable} from "../../../util/util";

export type Actions = ActionType<typeof actions>;

export interface State {
    firstVisited: boolean;
    jwt: string | null;
    stats: Stats;
    gameSessions: GameSession[];
}

function initialState(): State {
    const jwt = isSessionStorageAvailable() ? sessionStorage.getItem("jwt") : null;
    const firstVisited = isLocalStorageAvailable() ? localStorage.getItem("visited") : null;
    return {
        firstVisited: firstVisited === null,
        jwt,
        stats: {profit: 0, wagered: 0, numBets: 0},
        gameSessions: [],
    };
}

export default function account(state = initialState(), action: Actions): State {
    switch (action.type) {
        case types.CHANGE_FIRST_VISITED:
            return {...state, firstVisited: action.firstVisited};
        case types.CHANGE_JWT:
            return {...state, jwt: action.jwt};

        case types.CHANGE_USER_STATS:
            return {...state, stats: action.stats};
        case types.CHANGE_GAME_SESSIONS:
            return {...state, gameSessions: action.gameSessions};
        default:
            assertNever(action);
            return state;
    }
}
