import {Dispatch} from "../../../../util/util";
import {serverAcceptGame, serverRejectGame} from "./asyncActions";

type GameAcceptType = {gameId: number, serverHash: string}
type GameRejectType = {gameId: number, serverHash: string}


const listeners = {
    acceptedGameSession: (dispatch: Dispatch) => ({gameId, serverHash}: GameAcceptType ) => {
        dispatch(serverAcceptGame(gameId, serverHash));
    },
    rejectGameSession: (dispatch: Dispatch) => ({gameId}: GameRejectType ) => {
        dispatch(serverRejectGame(gameId));
    }
};

export default listeners
