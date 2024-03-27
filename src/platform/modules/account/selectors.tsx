import {jwtDecode} from "jwt-decode";
import {createSelector} from "reselect";

import {State} from "../../../rootReducer";
import {User} from "./types";

export const getUser = createSelector([(state: State) => state.account.jwt], (jwt) => {
    return jwt !== null ? jwtDecode<User>(jwt) : null;
});
