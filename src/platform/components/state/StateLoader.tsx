import * as React from 'react';

import {State} from '../../../rootReducer';
import {loadContractGameState, storeGameState, syncGameState} from '../../modules/games/state/asyncActions';
import {connect} from 'react-redux';
import {getUser} from "../../modules/account/selectors";
import {bindActionCreators, Dispatch} from "redux";


const mapStateToProps = (state: State) => {
    const {games, web3} = state;
    const {gameState} = games;

    return {
        gameState,
        userAuth: getUser(state),
        web3
    }
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => bindActionCreators({
    loadContractGameState,
    syncGameState
}, dispatch);


export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;


class StateLoader extends React.Component<Props> {
    constructor(props: Props)  {
        super(props);
    }

    componentWillMount() {
        const {syncGameState, userAuth} = this.props;

        if (userAuth !== null) {
            syncGameState(userAuth.address);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        const {loadContractGameState, syncGameState, userAuth: nextUserAuth, gameState: nextState, web3: nextWeb3State} = nextProps;
        const {userAuth: curUserAuth, gameState: curState, web3: curWeb3State} = this.props;

        if (nextProps.web3.contract !== this.props.web3.contract && nextProps.web3.contract !== null) {
            loadContractGameState();
        }

        if (nextUserAuth !== curUserAuth && nextUserAuth !== null
                || nextUserAuth !== null && nextWeb3State.account !== curWeb3State.account && nextWeb3State.account !== null) {
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
