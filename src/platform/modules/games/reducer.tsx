import {combineReducers} from "redux";

import info, {State as InfoState} from "./info/reducer";
import gameState, {State as GameState} from "./state/reducer";
import oneDice, {State as OneDiceState} from "../../../pages/games/chooseFrom12/reducer";
import dice, {State as DiceState} from "../../../pages/games/dice/reducer";
import flipACoin, {State as FlipACoinState} from "../../../pages/games/flipACoin/reducer";
import keno, {State as KenoState} from "../../../pages/games/keno/reducer";
import plinko, {State as PlinkoState} from "../../../pages/games/plinko/reducer";
import wheel, {State as WheelState} from "../../../pages/games/wheel/reducer";

export interface State {
    info: InfoState;
    gameState: GameState;
    dice: DiceState;
    oneDice: OneDiceState;
    flipACoin: FlipACoinState;
    keno: KenoState;
    wheel: WheelState;
    plinko: PlinkoState;
}

const reducers = combineReducers({
    info,
    gameState,
    dice,
    oneDice,
    flipACoin,
    keno,
    wheel,
    plinko,
});

export default reducers;
