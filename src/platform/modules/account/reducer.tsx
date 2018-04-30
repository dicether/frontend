import {Stats} from './types';
import * as types from './constants';
import {ActionType, assertNever, isLocalStorageAvailable, isSessionStorageAvailable} from "../../../util/util";
import * as actions from "./actions";

export type Actions = ActionType<typeof actions>;

export type State = {
    firstVisited: boolean,
    jwt: string|null,
    stats: Stats,
}

export default function account(state: State, action : Actions): State {
    switch(action.type) {
        case types.CHANGE_FIRST_VISITED:
            return Object.assign({}, state, {
                firstVisited: action.firstVisited
            });
        case types.CHANGE_JWT:
            return Object.assign({}, state, {
               jwt: action.jwt
            });

        case types.CHANGE_USER_STATS:
            return Object.assign({}, state, {
                stats: action.stats
            });
        default:
            assertNever(action);
            if (state === undefined) { // tslint:disable-line strict-type-predicates
                const jwt = isSessionStorageAvailable() ? sessionStorage.getItem('jwt') : null;
                const firstVisited = isLocalStorageAvailable() ? localStorage.getItem('visited') : null;
                return {
                    firstVisited: firstVisited === null,
                    jwt: jwt === null ? null : jwt,
                    stats: {profit: 0, wagered: 0, numBets: 0},
                };
            } else {
                return state;
            }
    }
}
