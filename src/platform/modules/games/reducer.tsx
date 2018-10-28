import {combineReducers} from "redux";

import oneDice, {State as OneDiceState} from "../../../pages/games/chooseFrom12/reducer";
import dice, {State as DiceState} from "../../../pages/games/dice/reducer";
import flipACoin, {State as FlipACoinState} from "../../../pages/games/flipACoin/reducer";
import info, {State as InfoState} from "./info/reducer";
import gameState, {State as GameState} from "./state/reducer";

export type State = {
    info: InfoState;
    gameState: GameState;
    dice: DiceState;
    oneDice: OneDiceState;
    flipACoin: FlipACoinState;
};

const reducers = combineReducers({
    info,
    gameState,
    dice,
    oneDice,
    flipACoin,
});

export default reducers;
