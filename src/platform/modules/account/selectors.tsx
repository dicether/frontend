import {createSelector} from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

import {State} from "../../../rootReducer";
import {User} from "./types";

export const getUser = createSelector([(state: State) => state.account.jwt], (jwt) => {
    return jwt !== null ? jwtDecode<User>(jwt) : null;
});
