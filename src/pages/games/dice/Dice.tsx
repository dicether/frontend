import * as React from 'react';
import {connect} from 'react-redux';

import DiceUi from './DiceUi';
import {placeBet} from '../../../platform/modules/games/state/asyncActions';
import sounds from '../sound';

import {DispatchProp} from '../../../util/util';
import {State} from '../../../rootReducer';
import {toggleHelp} from '../../../platform/modules/games/info/actions';
import {MAX_BET_VALUE, MIN_BET_VALUE} from '../../../config/config';
import {GameType} from "../../../stateChannel";


const mapStateToProps = ({games, account}: State) => {
    const {gameState, info} = games;

    return {
        gameState,
        info,
        loggedIn: account.jwt !== null
    }
};


type ReduxProps = ReturnType<typeof mapStateToProps>;


type Props = ReduxProps & DispatchProp;

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
        const {dispatch, info} = this.props;
        dispatch(toggleHelp(!info.showHelp))
    };

    onPlaceBet = (num: number, betValue: number, reversedRoll: boolean) => {
        const {info, dispatch} = this.props;

        const safeBetValue = Math.round(betValue / MIN_BET_VALUE) * MIN_BET_VALUE;
        const gameType = reversedRoll ? GameType.DICE_HIGHER : GameType.DICE_LOWER;

        dispatch(placeBet(num, safeBetValue, gameType)).then(result => {
            this.setState({result, showResult: true});
            clearTimeout(this.resultTimeoutId);
            this.resultTimeoutId = window.setTimeout(() => this.setState({showResult: false}), 5000);

            if (info.sound) {
                setTimeout(() => result.won ? sounds.win.playFromBegin() : sounds.lose.playFromBegin(), 500);
            }
        }).catch(console.log);
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

        return <DiceUi
            onBet={this.onPlaceBet}
            result={result}
            showResult={showResult}
            sound={info.sound}
            showHelp={info.showHelp}
            onToggleHelp={this.onToggleHelp}
            maxBetValue={maxBetValue}
        />
    }
}

export default connect(mapStateToProps)(Dice);
