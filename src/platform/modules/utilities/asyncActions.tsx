import * as Sentry from "@sentry/browser";
import {Dispatch} from "../../../util/util";
import {showErrorMessage} from "./actions";

function extractFirstLine(str: string) {
    const idx = str.indexOf("\n");
    return idx !== -1 ? str.substr(0, idx) : str;
}

export function catchError(error: any, dispatch: Dispatch) {
    // sentry expects an error object
    if (error instanceof Error) {
        Sentry.withScope(scope => {
            scope.setExtra("error_object", error);
            Sentry.captureException(error);
        });
    } else {
        Sentry.withScope(scope => {
            scope.setExtra("error_object", error);
            const sentryError = new Error(error.message);
            Sentry.captureException(sentryError);
        });
    }

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
