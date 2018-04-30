import axios from 'axios'
import {API_URL} from './config';


axios.defaults.baseURL = API_URL;

export function changeAxiosAuthToken(jwt : string|null) {
    if (jwt === null) {
        delete axios.defaults.headers.common['CustomAuthorization'] // tslint:disable-line no-string-literal
    } else {
        axios.defaults.headers.common = {
            CustomAuthorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        }
    }
}
