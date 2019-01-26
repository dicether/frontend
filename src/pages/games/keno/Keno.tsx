import {GameType, getNumSetBits, KENO_FIELDS, KENO_SELECTABLE_FIELDS, maxBet} from "@dicether/state-channel";
import BN from "bn.js";
import * as React from "react";
import {connect} from "react-redux";

import {MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
import {toggleHelp} from "../../../platform/modules/games/info/actions";
import {placeBet, validNetwork} from "../../../platform/modules/games/state/asyncActions";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";
import {catchError} from "../../../platform/modules/utilities/asyncActions";
import {State} from "../../../rootReducer";
import {getRandomInt} from "../../../util/math";
import {Dispatch} from "../../../util/util";
import sounds from "../sound";
import {canPlaceBet} from "../utilities";
import {changeNum, changeValue} from "./actions";
import Ui from "./components/Ui";

function selectRandomTile(num: number, numTiles: number) {
    let tile = 0;

    do {
        tile = getRandomInt(0, numTiles);
    } while ((1 << tile) & num); // tslint:disable-line:no-bitwise

    return tile;
}

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

class ChooseFrom12 extends React.PureComponent<Props, KenoState> {
    private loadedSounds = false;
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

    private onToggleHelp = () => {
        const {toggleHelp, info} = this.props;
        toggleHelp(!info.showHelp);
    }

    private onValueChange = (value: number) => {
        const {changeValue} = this.props;
        changeValue(value);
    }

    private onClick = (tile: number) => {
        const {keno, changeNum} = this.props;
        const {showResult, result} = this.state;
        const {num} = keno;

        if (showResult && result.num === tile) {
            this.setState({showResult: false});
        }

        const newNum = new BN(num).xor(new BN(1).shln(tile)).toNumber();
        changeNum(newNum);
    }

    private onAutoPick = () => {
        const {keno, changeNum} = this.props;
        const {num} = keno;

        if (getNumSetBits(num) === KENO_SELECTABLE_FIELDS) {
            return;
        }

        const numBN = new BN(num);
        let tile = 0;
        do {
            tile = selectRandomTile(num, KENO_FIELDS);
        } while (numBN.and(new BN(1).shln(tile)).toNumber());

        const newNum = numBN.xor(new BN(1).shln(tile)).toNumber();
        changeNum(newNum);
        sounds.menuDown.playFromBegin();

        setTimeout(this.onAutoPick, 100);
    }

    private onClear = () => {
        const {changeNum} = this.props;
        changeNum(1);
    }

    private onPlaceBet = () => {
        const {info, keno, placeBet, catchError, showErrorMessage, web3Available, gameState, loggedIn} = this.props;

        const safeBetValue = Math.round(keno.value);
        const num = keno.num;
        const gameType = GameType.KENO;

        if (!this.loadedSounds) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.win.load();
            sounds.lose.load();
            sounds.menuDown.load();
            this.loadedSounds = true;
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

                    this.showResult();
                })
                .catch(error => catchError(error));
        } else {
            showErrorMessage(canBet.errorMessage);
        }
    }

    private showResult = () => {
        const {keno} = this.props;
        const {num} = keno;
        const {result, showResult, tmpResult} = this.state;
        const {num: resultNum} = result;

        const resultNumBn = new BN(resultNum);
        let newTmpResult = tmpResult;
        const start = tmpResult === 0 ? 0 : Math.floor(Math.log2(tmpResult)) + 1;

        let hit = false;
        for (let i = start; i < KENO_FIELDS; i++) {
            const curBit = new BN(1).shln(i);
            if (curBit.and(resultNumBn).toNumber() !== 0) {
                newTmpResult = new BN(tmpResult).or(curBit).toNumber();
                hit = curBit.and(new BN(num)).toNumber() !== 0;
                break;
            }
        }

        this.setState({tmpResult: newTmpResult});

        if (hit) {
            sounds.win.playFromBegin();
        } else {
            sounds.menuDown.playFromBegin();
        }

        if (newTmpResult !== resultNum && showResult) {
            window.setTimeout(this.showResult, 200);
        } else if (newTmpResult === resultNum && showResult) {
            this.setState({showResultProfit: true});
        }
    }

    render() {
        const {info, gameState, keno} = this.props;
        const {num, value} = keno;
        const {result, showResult, tmpResult, showResultProfit} = this.state;

        let maxBetValue = maxBet(GameType.KENO, num, MIN_BANKROLL);
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChooseFrom12);
