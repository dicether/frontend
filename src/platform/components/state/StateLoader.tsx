import * as React from "react";

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
        dispatch
    );

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class StateLoader extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        const {syncGameState, userAuth, web3} = this.props;

        if (userAuth !== null && web3.web3 && web3.account && web3.contract && validChainId(web3.chainId)) {
            syncGameState(userAuth.address);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        const {syncGameState, userAuth: nextUserAuth, gameState: nextState, web3: nextWeb3State} = nextProps;
        const {userAuth: curUserAuth, gameState: curState, web3: curWeb3State} = this.props;

        if (
            nextUserAuth !== null &&
            nextWeb3State.web3 &&
            nextWeb3State.account &&
            nextWeb3State.contract &&
            validChainId(nextWeb3State.chainId) &&
            (nextUserAuth !== curUserAuth ||
                nextWeb3State.account !== curWeb3State.account ||
                nextWeb3State.chainId !== curWeb3State.chainId)
        ) {
            syncGameState(nextUserAuth.address);
        }

        if (nextState !== curState && nextUserAuth) {
            storeGameState(nextUserAuth.address, nextState);
        }
    }

    render() {
        return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StateLoader);
