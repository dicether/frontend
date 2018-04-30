import {Dispatch} from "../../../util/util";
import {Bet} from "./types";
import {addNewBet} from "./asyncActions";

const listeners = {
    bet: (dispatch: Dispatch) => (bet: Bet) => {
        dispatch(addNewBet(bet));
    }
};

export default listeners;
