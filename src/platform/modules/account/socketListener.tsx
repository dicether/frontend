import {Dispatch} from "../../../util/util";
import {authenticateSocket} from "./asyncActions";

const listeners = {
    connect: (dispatch: Dispatch) => () => {
        dispatch(authenticateSocket());
    }
};

export default listeners;
