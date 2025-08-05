import axios, {AxiosError} from "axios";

import {deauthenticate} from "../platform/modules/account/asyncActions";
import {store} from "../store";

axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError | Error) => {
        if (axios.isAxiosError(error) && error.response != null && error.response.status === 401) {
            store.dispatch(deauthenticate());
            return Promise.reject(new Error("Session timeout!"));
        } else {
            return Promise.reject(error);
        }
    },
);
