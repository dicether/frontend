import {combineReducers} from "redux";

import dice, {State as DiceState} from "../../../pages/games/dice/reducer";
import info, {State as InfoState} from "./info/reducer";
import gameState, {State as GameState} from "./state/reducer";

export type State = {
    info: InfoState;
    gameState: GameState;
    dice: DiceState;
};

const reducers = combineReducers({
    info,
    gameState,
    dice,
});

export default reducers;
