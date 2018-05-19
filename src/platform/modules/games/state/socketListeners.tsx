import {Dispatch} from "../../../../util/util";
import {serverAcceptGame} from "./asyncActions";

type GameAcceptType = {gameId: number, serverHash: string}
type GameRejectType = {gameId: number, serverHash: string}


const listeners = {
    acceptedGameSession: (dispatch: Dispatch) => ({gameId, serverHash}: GameAcceptType ) => {
        dispatch(serverAcceptGame(gameId, serverHash));
    }
};

export default listeners
