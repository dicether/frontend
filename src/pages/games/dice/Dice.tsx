import * as React from 'react';
import DocumentTitle from 'react-document-title';
import {connect} from 'react-redux';

import DiceUi from './DiceUi';
import {placeBet} from '../../../platform/modules/games/state/asyncActions';
import sounds from '../sound';

import {State} from '../../../rootReducer';
import {toggleHelp} from '../../../platform/modules/games/info/actions';
import {MAX_BET_VALUE, MIN_BET_VALUE} from '../../../config/config';
import {GameType} from "../../../stateChannel";
import {bindActionCreators, Dispatch} from "redux";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";


const mapStateToProps = ({games, account}: State) => {
    const {gameState, info} = games;

    return {
        gameState,
        info,
        loggedIn: account.jwt !== null
    }
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    placeBet: (num, safeBetValue, gameType) => dispatch(placeBet(num, safeBetValue, gameType)),
    toggleHelp: (t) => dispatch(toggleHelp(t)),
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
        const {info, placeBet} = this.props;

        const safeBetValue = Math.round(betValue);
        const gameType = reversedRoll ? GameType.DICE_HIGHER : GameType.DICE_LOWER;

        placeBet(num, safeBetValue, gameType).then(result => {
            this.setState({result, showResult: true});
            clearTimeout(this.resultTimeoutId);
            this.resultTimeoutId = window.setTimeout(() => this.setState({showResult: false}), 5000);

            if (info.sound) {
                setTimeout(() => result.won ? sounds.win.playFromBegin() : sounds.lose.playFromBegin(), 500);
            }
        }).catch(error => showErrorMessage(error.message));
    };

    render() {
        const {result, showResult} = this.state;
        const {info, gameState} = this.props;

        let maxBetValue = MAX_BET_VALUE;
        if (gameState.status !== 'ENDED') {
            // TODO: Allow value + balance with new contract
            const max = Math.min(gameState.stake + gameState.balance, gameState.stake, MAX_BET_VALUE);
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
