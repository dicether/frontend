import axios from "axios";

import {deauthenticate} from "../platform/modules/account/asyncActions";
import {store} from "../store";

axios.interceptors.response.use(
    response => response,
    error => {
        if (
            typeof error === "object" &&
            error !== null &&
            typeof error.response === "object" &&
            error.response !== null &&
            error.response.status === 401
        ) {
            store.dispatch(deauthenticate());
            return Promise.reject(new Error("Session timeout!"));
        } else {
            return Promise.reject(error);
        }
    }
);
