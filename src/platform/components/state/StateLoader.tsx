import {useEffect, useRef} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {State} from "../../../rootReducer";
import {Dispatch} from "../../../util/util";
import {getUser} from "../../modules/account/selectors";
import {storeGameState, syncGameState, validChainId} from "../../modules/games/state/asyncActions";

const mapStateToProps = (state: State) => {
    const {games, web3} = state;
    const {gameState} = games;

    return {
        gameState,
        userAuth: getUser(state),
        web3,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            syncGameState,
        },
        dispatch,
    );

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const StateLoader = ({gameState, syncGameState, userAuth, web3}: Props) => {
    useEffect(() => {
        if (userAuth !== null && web3.web3 && web3.account && web3.contract && validChainId(web3.chainId)) {
            syncGameState(web3.chainId!, userAuth.address);
        }
    }, []);

    useEffect(() => {
        if (userAuth !== null && web3.web3 && web3.account && web3.contract && validChainId(web3.chainId)) {
            syncGameState(web3.chainId!, userAuth.address);
        }
    }, [web3.account, web3.chainId, userAuth]);

    const isFirstRun = useRef(true);
    useEffect(() => {
        if (userAuth && !isFirstRun.current) {
            storeGameState(userAuth.address, gameState);
        }
        isFirstRun.current = false;
    }, [gameState]);

    return null;
};

export default connect(mapStateToProps, mapDispatchToProps)(StateLoader);
