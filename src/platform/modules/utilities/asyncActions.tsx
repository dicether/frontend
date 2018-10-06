import Raven from "raven-js";
import {Dispatch} from "../../../util/util";
import {showErrorMessage} from "./actions";

function extractFirstLine(str: string) {
    const idx = str.indexOf("\n");
    return idx !== -1 ? str.substr(0, idx) : str;
}

export function catchError(error: any, dispatch: Dispatch) {
    Raven.captureException(error);

    const response = error.response;
    const data = response ? response.data : null;
    const statusText = response ? response.statusText : null;
    const message = data && data.error ? data.error.message : statusText || error.message || false;

    if (message && message.length !== 0) {
        let messageToShow = message;

        // do not completely show very long messages
        if (messageToShow.length > 100) {
            messageToShow = extractFirstLine(message);
        }
        dispatch(showErrorMessage(messageToShow));
    }
}
