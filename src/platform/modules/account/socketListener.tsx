import {authenticateSocket} from "./asyncActions";
import {Dispatch} from "../../../util/util";

const listeners = {
    connect: (dispatch: Dispatch) => () => {
        dispatch(authenticateSocket());
    },
};

export default listeners;
