import * as React from 'react';
import DocumentTitle from 'react-document-title';
import {connect} from 'react-redux';
import {GameType} from "@dicether/state-channel";

import DiceUi from './DiceUi';
import {placeBet, validNetwork} from '../../../platform/modules/games/state/asyncActions';
import sounds from '../sound';
import {State} from '../../../rootReducer';
import {toggleHelp} from '../../../platform/modules/games/info/actions';
import {MAX_BET_VALUE, MIN_BET_VALUE, NETWORK_NAME} from '../../../config/config';
import {Dispatch} from "redux";
import {catchError} from "../../../platform/modules/utilities/asyncActions";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";


const mapStateToProps = ({games, account, web3}: State) => {
    const {gameState, info} = games;

    return {
        web3Available: web3.account && web3.contract && web3.web3 && validNetwork(web3.networkId),
        gameState,
        info,
        loggedIn: account.jwt !== null
    }
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    placeBet: (num, safeBetValue, gameType) => dispatch(placeBet(num, safeBetValue, gameType)),
    toggleHelp: (t) => dispatch(toggleHelp(t)),
    catchError: (error) => catchError(error, dispatch),
    showErrorMessage: (message) => dispatch(showErrorMessage(message))
});



type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;


type DiceState = {
    result: {num: number, won: boolean},
    showResult: boolean;
}


class Dice extends React.Component<Props, DiceState> {
    resultTimeoutId?: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            showResult: false,
            result: {num: 1, won: false}
        };
    }

    componentWillUnmount() {
        window.clearTimeout(this.resultTimeoutId);
    }

    onToggleHelp = () => {
        const {toggleHelp, info} = this.props;
        toggleHelp(!info.showHelp);
    };

    onPlaceBet = (num: number, betValue: number, reversedRoll: boolean) => {
        const {info, placeBet, catchError, web3Available, showErrorMessage} = this.props;

        const safeBetValue = Math.round(betValue);
        const gameType = reversedRoll ? GameType.DICE_HIGHER : GameType.DICE_LOWER;

        if (!web3Available) {
            showErrorMessage(`You need to have a web3 enabled browser (e.g. Metamask) for playing and select network: ${NETWORK_NAME}!`);
            return;
        }

        placeBet(num, safeBetValue, gameType).then(result => {
            this.setState({result, showResult: true});
            clearTimeout(this.resultTimeoutId);
            this.resultTimeoutId = window.setTimeout(() => this.setState({showResult: false}), 5000);

            if (info.sound) {
                setTimeout(() => result.won ? sounds.win.playFromBegin() : sounds.lose.playFromBegin(), 500);
            }
        }).catch(error => catchError(error));
    };

    render() {
        const {result, showResult} = this.state;
        const {info, gameState} = this.props;

        let maxBetValue = MAX_BET_VALUE;
        if (gameState.status !== 'ENDED') {
            const max = Math.min(gameState.stake + gameState.balance, MAX_BET_VALUE);
            maxBetValue = Math.max(max, MIN_BET_VALUE);
        }

        return (
            <DocumentTitle title="Ethereum State Channel Dice - Dicether">
                <DiceUi
                stake={gameState.stake}
                onBet={this.onPlaceBet}
                result={result}
                showResult={showResult}
                sound={info.sound}
                showHelp={info.showHelp}
                onToggleHelp={this.onToggleHelp}
                maxBetValue={maxBetValue}
                />
            </DocumentTitle>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dice);
