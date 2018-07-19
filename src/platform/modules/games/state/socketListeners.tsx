import {Dispatch} from "../../../../util/util";
import {loadContractGameState, serverActiveGame, syncGameState} from "./asyncActions";
import {catchError} from "../../utilities/asyncActions";

type GameAcceptType = {gameId: number, serverHash: string}
type GameRejectType = {gameId: number, serverHash: string}


const listeners = {
    gameSessionActive: (dispatch: Dispatch) => ({gameId, serverHash}: GameAcceptType ) => {
        dispatch(serverActiveGame(gameId, serverHash));
    },
    gameSessionConflictEnded: (dispatch: Dispatch) => ({gameId}: GameAcceptType ) => {
        dispatch(loadContractGameState()).catch(error => catchError(error, dispatch));
    },
    gameSessionEnded: (dispatch: Dispatch) => ({gameId}: GameAcceptType ) => {
        dispatch(loadContractGameState()).catch(error => catchError(error, dispatch));
    }
};

export default listeners
