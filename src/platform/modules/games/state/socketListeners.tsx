import {Dispatch} from "../../../../util/util";
import {serverActiveGame} from "./asyncActions";

type GameAcceptType = {gameId: number, serverHash: string}
type GameRejectType = {gameId: number, serverHash: string}


const listeners = {
    acceptedGameSession: (dispatch: Dispatch) => ({gameId, serverHash}: GameAcceptType ) => {
        dispatch(serverActiveGame(gameId, serverHash));
    }
};

export default listeners
