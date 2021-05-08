import {Dispatch} from "../../../../util/util";
import {catchError} from "../../utilities/asyncActions";
import {loadContractGameState, serverActiveGame} from "./asyncActions";

type GameAcceptType = {gameId: number; serverHash: string; userHash: string};

const listeners = {
    gameSessionActive: (dispatch: Dispatch) => ({gameId, serverHash, userHash}: GameAcceptType) => {
        dispatch(serverActiveGame(gameId, serverHash, userHash));
    },
    gameSessionConflictEnded: (dispatch: Dispatch) => () => {
        dispatch(loadContractGameState()).catch(error => catchError(error, dispatch));
    },
    gameSessionEnded: (dispatch: Dispatch) => () => {
        dispatch(loadContractGameState()).catch(error => catchError(error, dispatch));
    },
};

export default listeners;
