import axios from "axios";

import {API_URL} from "./config";

axios.defaults.baseURL = API_URL;

export function changeAxiosAuthToken(jwt: string | null) {
    if (jwt === null) {
        delete axios.defaults.headers.common.Authorization;
        delete axios.defaults.headers.common.CustomAuthorization;
    } else {
        axios.defaults.headers.common = {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
        };
    }
}
