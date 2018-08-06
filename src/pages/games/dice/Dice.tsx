import * as React from 'react';
import DocumentTitle from 'react-document-title';
import {connect} from 'react-redux';
import {GameType} from "@dicether/state-channel";

import DiceUi from './components/DiceUi';
import {placeBet, validNetwork} from '../../../platform/modules/games/state/asyncActions';
import sounds from '../sound';
import {State} from '../../../rootReducer';
import {toggleHelp} from '../../../platform/modules/games/info/actions';
import {
    HOUSE_EDGE,
    HOUSE_EDGE_DIVISOR,
    MAX_BET_VALUE,
    MIN_BET_VALUE,
    NETWORK_NAME,
    RANGE
} from '../../../config/config';
import {Dispatch} from "redux";
import {catchError} from "../../../platform/modules/utilities/asyncActions";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";
import {changeNum, changeRollMode, changeValue} from "./actions";


function calcChance(num: number, reversedRoll: boolean) {
    return reversedRoll ?  (RANGE - num - 1) / RANGE : num / RANGE;
}

function calcPayOutMultiplier(num: number, reversedRoll: boolean) {
    const houseEdgeFactor = (1 - HOUSE_EDGE / HOUSE_EDGE_DIVISOR);

    return reversedRoll ? RANGE / (RANGE - num - 1) * houseEdgeFactor : RANGE / num * houseEdgeFactor;
}


function calcNumberFromPayOutMultiplier(multiplier: number, reversedRoll: boolean) {
    const houseEdgeFactor = (1 - HOUSE_EDGE / HOUSE_EDGE_DIVISOR);
    const n = RANGE / multiplier * houseEdgeFactor;
    const num =  reversedRoll ? (RANGE - 1 - n) : n;
    return Math.round(num);
}



const mapStateToProps = ({games, account, web3}: State) => {
    const {gameState, info, dice} = games;

    return {
        web3Available: web3.account && web3.contract && web3.web3 && validNetwork(web3.networkId),
        gameState,
        info,
        dice,
        loggedIn: account.jwt !== null
    }
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    placeBet: (num, safeBetValue, gameType) => dispatch(placeBet(num, safeBetValue, gameType)),
    changeNum: (num) => dispatch(changeNum(num)),
    changeValue: (value) => dispatch(changeValue(value)),
    changeRollMode: (reverse) => dispatch(changeRollMode(reverse)),
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

    onNumberChange = (num: number) => {
        const {changeNum} = this.props;
        changeNum(num);
    };

    onValueChange = (value: number) => {
        const {changeValue} = this.props;
        changeValue(value);
    };

    onMultiplierChange = (multiplier: number) => {
        const {dice, changeNum} = this.props;
        const num = calcNumberFromPayOutMultiplier(multiplier, dice.reverseRoll);
        changeNum(num);
    };

    onChanceChange = (chance: number) => {
        const {dice, changeNum} = this.props;

        const num = dice.reverseRoll ?  RANGE - 1 - RANGE * chance : RANGE * chance;
        changeNum(num);
    };

    onReverseRoll = () => {
        const {dice, changeRollMode} = this.props;
        changeRollMode(!dice.reverseRoll);
        changeNum(RANGE - 1 - dice.num);
    };

    onPlaceBet = () => {
        const {info, dice, placeBet, catchError, web3Available, showErrorMessage, gameState, loggedIn} = this.props;

        const safeBetValue = Math.round(dice.value);
        const num = dice.num;
        const gameType = dice.reverseRoll ? GameType.DICE_HIGHER : GameType.DICE_LOWER;

        if (!loggedIn) {
            showErrorMessage("You need to login before playing!");
            return;
        }

        if (!web3Available) {
            showErrorMessage(`You need to have a web3 enabled browser (e.g. Metamask) for playing and select network: ${NETWORK_NAME}!`);
            return;
        }

        if (gameState.status === "ENDED") {
            showErrorMessage("You need to create a game session before playing!");
            return;
        }

        if (gameState.status === "PLACED_BET") {
            showErrorMessage("Your seed isn't revealed! Should normally work without your interaction." +
                " To manually reveal it You can click \"request seed\"!");
            return;
        }

        if (gameState.status !== "ACTIVE") {
            showErrorMessage("Can not place bet! You game session must be active to create bets!");
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
        const {info, gameState, dice} = this.props;

        let maxBetValue = MAX_BET_VALUE;
        if (gameState.status !== 'ENDED') {
            const max = Math.min(gameState.stake + gameState.balance, MAX_BET_VALUE);
            maxBetValue = Math.max(max, MIN_BET_VALUE);
        }

        return (
            <DocumentTitle title="Ethereum State Channel Dice - Dicether">
                <DiceUi
                    num={dice.num}
                    value={dice.value}
                    onNumberChange={this.onNumberChange}
                    onValueChange={this.onValueChange}
                    onReverseRoll={this.onReverseRoll}
                    onPlaceBet={this.onPlaceBet}
                    reverseRoll={dice.reverseRoll}
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
