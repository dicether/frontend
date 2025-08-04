import {addNewBet} from "./asyncActions";
import {Bet} from "./types";
import {Dispatch} from "../../../util/util";

const listeners = {
    bet: (dispatch: Dispatch) => (bet: Bet) => {
        dispatch(addNewBet(bet));
    },
};

export default listeners;
