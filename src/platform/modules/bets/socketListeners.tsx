import {Dispatch} from "../../../util/util";
import {addNewBet} from "./asyncActions";
import {Bet} from "./types";

const listeners = {
    bet: (dispatch: Dispatch) => (bet: Bet) => {
        dispatch(addNewBet(bet));
    },
};

export default listeners;
