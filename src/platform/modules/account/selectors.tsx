import {createSelector} from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

import {User} from "./types";
import {State} from "../../../rootReducer";

export const getUser = createSelector([(state: State) => state.account.jwt], (jwt) => {
    return jwt !== null ? jwtDecode<User>(jwt) : null;
});
