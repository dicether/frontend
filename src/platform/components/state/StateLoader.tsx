import {useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {useConnection} from "wagmi";

import {State} from "../../../rootReducer";
import {useDispatch} from "../../../util/util";
import {getUser} from "../../modules/account/selectors";
import {storeGameState, syncGameState, validChainId} from "../../modules/games/state/asyncActions";

const StateLoader = () => {
    const connection = useConnection();
    const dispatch = useDispatch();

    const gameState = useSelector((state: State) => state.games.gameState);
    const userAuth = useSelector((state: State) => getUser(state));

    useEffect(() => {
        if (connection.isConnected && connection.chainId && userAuth?.address && validChainId(connection.chainId)) {
            void dispatch(syncGameState(connection.chainId, userAuth.address));
        }
    }, []);

    useEffect(() => {
        if (connection.isConnected && connection.chainId && userAuth?.address && validChainId(connection.chainId)) {
            void dispatch(syncGameState(connection.chainId, userAuth.address));
        }
    }, [connection.address, connection.chainId, userAuth]);

    const isFirstRun = useRef(true);
    useEffect(() => {
        if (userAuth && !isFirstRun.current) {
            storeGameState(userAuth.address, gameState);
        }
        isFirstRun.current = false;
    }, [gameState]);

    return null;
};

export default StateLoader;
