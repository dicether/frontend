import * as React from "react";
import {connect} from "react-redux";

import {GameType, maxBet} from "@dicether/state-channel";
import {KELLY_FACTOR, MAX_BET_VALUE, MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
import {addNewBet} from "../../../platform/modules/bets/asyncActions";
import {Bet} from "../../../platform/modules/bets/types";
import {toggleHelp} from "../../../platform/modules/games/info/actions";
import {placeBet, validChainId} from "../../../platform/modules/games/state/asyncActions";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";
import {catchError} from "../../../platform/modules/utilities/asyncActions";
import {State} from "../../../rootReducer";
import {Dispatch} from "../../../util/util";
import sounds from "../sound";
import {canPlaceBet} from "../utilities";
import {changeNum, changeValue} from "./actions";
import Ui from "./components/Ui";
import {Helmet} from "react-helmet";

const mapStateToProps = ({games, account, web3}: State) => {
    const {info, flipACoin, gameState} = games;
    const web3Available = web3.account && web3.contract && web3.web3 && validChainId(web3.chainId);

    return {
        web3Available: web3Available === true,
        info,
        flipACoin,
        gameState,
        loggedIn: account.jwt !== null,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    placeBet: (num: number, value: number, gameType: number) => dispatch(placeBet(num, value, gameType)),
    addNewBet: (bet: Bet) => dispatch(addNewBet(bet)),
    changeNum: (num: number) => dispatch(changeNum(num)),
    changeValue: (value: number) => dispatch(changeValue(value)),
    toggleHelp: (t: boolean) => dispatch(toggleHelp(t)),
    showErrorMessage: (message: string) => dispatch(showErrorMessage(message)),
    catchError: (error: Error) => catchError(error, dispatch),
});

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export type OneDiceState = {
    showResult: boolean;
    result: {num: number; won: boolean};
};

class FlipACoin extends React.PureComponent<Props, OneDiceState> {
    private loadedSounds = false;
    private resultTimeoutId = 0;

    constructor(props: Props) {
        super(props);
        this.state = {
            showResult: false,
            result: {num: 0, won: false},
        };
    }

    private onToggleHelp = () => {
        const {toggleHelp, info} = this.props;
        toggleHelp(!info.showHelp);
    };

    private onValueChange = (value: number) => {
        const {changeValue} = this.props;
        changeValue(value);
    };

    private onClick = (num: number) => {
        const {changeNum, flipACoin} = this.props;
        const {showResult, result} = this.state;

        if (showResult && result.num === num) {
            this.setState({showResult: false});
        }

        const newNum = flipACoin.num === num ? 1 - num : num;
        changeNum(newNum);
    };

    private onPlaceBet = () => {
        const {info, flipACoin, addNewBet, placeBet, catchError, showErrorMessage, web3Available, gameState, loggedIn} =
            this.props;
        const {value, num} = flipACoin;

        const safeBetValue = Math.round(value);
        const gameType = GameType.FLIP_A_COIN;

        if (!this.loadedSounds) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.win.load();
            sounds.lose.load();
            this.loadedSounds = true;
        }

        const canBet = canPlaceBet(gameType, num, safeBetValue, loggedIn, web3Available, gameState);
        if (canBet.canPlaceBet) {
            this.setState({showResult: false});
            placeBet(num, safeBetValue, gameType)
                .then((result) => {
                    this.setState({result, showResult: true});
                    clearTimeout(this.resultTimeoutId);
                    this.resultTimeoutId = window.setTimeout(() => this.setState({showResult: false}), 5000);

                    addNewBet(result.bet);
                    if (info.sound) {
                        setTimeout(() => (result.won ? sounds.win.playFromBegin() : sounds.lose.playFromBegin()), 500);
                    }
                })
                .catch((error) => catchError(error));
        } else {
            showErrorMessage(canBet.errorMessage);
        }
    };

    render() {
        const {info, gameState, flipACoin} = this.props;
        const {num, value} = flipACoin;
        const {result, showResult} = this.state;

        let maxBetValue = Math.min(maxBet(GameType.FLIP_A_COIN, num, MIN_BANKROLL, KELLY_FACTOR), MAX_BET_VALUE);
        if (gameState.status !== "ENDED") {
            const max = Math.min(gameState.stake + gameState.balance, maxBetValue);
            maxBetValue = Math.max(max, MIN_BET_VALUE);
        }

        return (
            <>
                <Helmet>
                    <title>Flip a Coin - Dicether</title>
                    <meta name="description" content="Ethereum state channel based Flip a Coin game" />
                </Helmet>
                <Ui
                    num={num}
                    value={value}
                    maxBetValue={maxBetValue}
                    onValueChange={this.onValueChange}
                    onClick={this.onClick}
                    onPlaceBet={this.onPlaceBet}
                    showResult={showResult}
                    result={result}
                    showHelp={info.showHelp}
                    onToggleHelp={this.onToggleHelp}
                />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlipACoin);
