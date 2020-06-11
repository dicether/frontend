import {
    GameType,
    getNumSetBits,
    getSetBits,
    KENO_FIELDS,
    KENO_SELECTABLE_FIELDS,
    maxBet,
} from "@dicether/state-channel";
import BN from "bn.js";
import * as React from "react";
import {connect} from "react-redux";

import {MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
import {addNewBet} from "../../../platform/modules/bets/asyncActions";
import {Bet} from "../../../platform/modules/bets/types";
import {toggleHelp} from "../../../platform/modules/games/info/actions";
import {placeBet, validNetwork} from "../../../platform/modules/games/state/asyncActions";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";
import {catchError} from "../../../platform/modules/utilities/asyncActions";
import {State} from "../../../rootReducer";
import {getRandomInt, shuffle} from "../../../util/math";
import {Dispatch} from "../../../util/util";
import sounds from "../sound";
import {canPlaceBet} from "../utilities";
import {changeNum, changeValue} from "./actions";
import Ui from "./components/Ui";

const mapStateToProps = ({games, account, web3}: State) => {
    const {info, keno, gameState} = games;
    const web3Available = web3.account && web3.contract && web3.web3 && validNetwork(web3.networkId);

    return {
        web3Available: web3Available === true,
        info,
        keno,
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

export type KenoState = {
    showResult: boolean;
    result: {betNum: number; num: number; won: boolean; userProfit: number};
    tmpResult: number;

    showResultProfit: boolean;
};

class Keno extends React.PureComponent<Props, KenoState> {
    private loadedSounds = false;
    private pickTimeoutId = 0;
    private resultTimeoutId = 0;

    constructor(props: Props) {
        super(props);
        this.state = {
            showResult: false,
            result: {betNum: 0, num: 0, won: false, userProfit: 0},
            tmpResult: 0,
            showResultProfit: false,
        };
    }

    componentWillUnmount() {
        clearTimeout(this.pickTimeoutId);
        clearTimeout(this.resultTimeoutId);
    }

    private onToggleHelp = () => {
        const {toggleHelp, info} = this.props;
        toggleHelp(!info.showHelp);
    };

    private onValueChange = (value: number) => {
        const {changeValue} = this.props;
        changeValue(value);
    };

    private onClick = (tile: number) => {
        const {keno, changeNum} = this.props;
        const {showResult} = this.state;
        const {num} = keno;

        if (showResult) {
            return;
        }

        const newNum = new BN(num).xor(new BN(1).shln(tile)).toNumber();
        changeNum(newNum);
    };

    private onAutoPick = () => {
        const {keno, changeNum} = this.props;
        const {num} = keno;

        if (getNumSetBits(num) === KENO_SELECTABLE_FIELDS) {
            return;
        }

        const numBN = new BN(num);
        const oneBN = new BN(1);
        let tile = 0;
        do {
            tile = getRandomInt(0, KENO_FIELDS);
        } while (numBN.and(oneBN.shln(tile)).toNumber() !== 0);

        const newNum = numBN.xor(oneBN.shln(tile)).toNumber();
        changeNum(newNum);
        this.playSound(sounds.menuDown);

        this.pickTimeoutId = window.setTimeout(this.onAutoPick, 100);
    };

    private onClear = () => {
        const {changeNum} = this.props;
        const {showResult} = this.state;
        if (showResult) {
            return;
        }
        changeNum(0);
    };

    private onPlaceBet = () => {
        const {
            keno,
            addNewBet,
            placeBet,
            catchError,
            showErrorMessage,
            web3Available,
            gameState,
            loggedIn,
        } = this.props;

        const safeBetValue = Math.round(keno.value);
        const num = keno.num;
        const gameType = GameType.KENO;

        if (!this.loadedSounds) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.tileHit.load();
            sounds.tileMiss.load();
            sounds.menuDown.load();
            this.loadedSounds = true;
        }

        if (num === 0) {
            return;
        }

        const canBet = canPlaceBet(gameType, num, safeBetValue, loggedIn, web3Available, gameState);
        if (canBet.canPlaceBet) {
            placeBet(num, safeBetValue, gameType)
                .then(result => {
                    this.setState({result, showResult: true, tmpResult: 0});
                    clearTimeout(this.resultTimeoutId);
                    this.resultTimeoutId = window.setTimeout(
                        () =>
                            this.setState({
                                showResult: false,
                                tmpResult: 0,
                                showResultProfit: false,
                            }),
                        5000
                    );

                    addNewBet(result.bet);
                    this.showResult();
                })
                .catch(error => catchError(error));
        } else {
            showErrorMessage(canBet.errorMessage);
        }
    };

    private showResultHelper = (indices: number[]) => {
        const {showResult, tmpResult, result} = this.state;
        if (!showResult || indices.length === 0) {
            return;
        }

        const idx = indices[0];
        const newBit = new BN(1).shln(idx);
        const newTmpResult = new BN(tmpResult).or(newBit).toNumber();

        this.setState({tmpResult: newTmpResult});

        if (newBit.and(new BN(result.betNum)).toNumber() !== 0) {
            this.playSound(sounds.tileHit);
        } else {
            this.playSound(sounds.tileMiss);
        }

        indices.shift();

        if (indices.length === 0) {
            this.setState({showResultProfit: true});
        } else {
            window.setTimeout(this.showResultHelper, 200, indices);
        }
    };

    private showResult = () => {
        const {result} = this.state;
        const {num} = result;
        const resultTiles = getSetBits(num);

        const indices = resultTiles.map((x, i) => (x ? i : -1)).filter(idx => idx !== -1);
        shuffle(indices);
        this.showResultHelper(indices);
    };

    private playSound = (audio: HTMLAudioElement) => {
        const {info} = this.props;
        const {sound} = info;

        if (sound) {
            audio.playFromBegin();
        }
    };

    render() {
        const {info, gameState, keno} = this.props;
        const {num, value} = keno;
        const {result, showResult, tmpResult, showResultProfit} = this.state;

        let maxBetValue = maxBet(GameType.KENO, num === 0 ? 1 : num, MIN_BANKROLL);
        if (gameState.status !== "ENDED") {
            const max = Math.min(gameState.stake + gameState.balance, maxBetValue);
            maxBetValue = Math.max(max, MIN_BET_VALUE);
        }

        return (
            <Ui
                num={num}
                value={value}
                maxBetValue={maxBetValue}
                onValueChange={this.onValueChange}
                onClick={this.onClick}
                onAutoPick={this.onAutoPick}
                onClear={this.onClear}
                onPlaceBet={this.onPlaceBet}
                showResult={showResult}
                showResultProfit={showResultProfit}
                result={{...result, num: tmpResult}}
                showHelp={info.showHelp}
                onToggleHelp={this.onToggleHelp}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Keno);
