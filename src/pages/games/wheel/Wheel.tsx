import {GameType, maxBet} from "@dicether/state-channel";
import BN from "bn.js";
import * as React from "react";
import {connect} from "react-redux";

import {MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
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

const mapStateToProps = ({games, account, web3, app}: State) => {
    const {info, gameState, wheel} = games;
    const web3Available = web3.account && web3.contract && web3.web3 && validNetwork(web3.networkId);

    return {
        web3Available: web3Available === true,
        info,
        gameState,
        loggedIn: account.jwt !== null,
        wheel,
        nightMode: app.nightMode,
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
};

class Wheel extends React.PureComponent<Props, KenoState> {
    private loadedSounds = false;
    private resultShowTimeoutId = 0;
    private resultUntilShowTimeoutId = 0;

    constructor(props: Props) {
        super(props);
        this.state = {
            showResult: false,
            result: {betNum: 0, num: 0, won: false, userProfit: 0},
        };
    }

    private onToggleHelp = () => {
        const {toggleHelp, info} = this.props;
        toggleHelp(!info.showHelp);
    }

    private onPlaceBet = () => {
        const {wheel, placeBet, catchError, showErrorMessage, web3Available, gameState, loggedIn} = this.props;

        const safeBetValue = Math.round(wheel.value);
        const num = wheel.num;
        const gameType = GameType.WHEEL;

        if (!this.loadedSounds) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.win.load();
            sounds.lose.load();
            sounds.menuDown.load();
            this.loadedSounds = true;
        }

        if (num === 0) {
            return;
        }

        const canBet = canPlaceBet(gameType, num, safeBetValue, loggedIn, web3Available, gameState);
        if (canBet.canPlaceBet) {
            this.setState({
                showResult: false,
            });
            placeBet(num, safeBetValue, gameType)
                .then(result => {
                    this.setState({result});
                    clearTimeout(this.resultUntilShowTimeoutId);
                    this.resultUntilShowTimeoutId = window.setTimeout(() => {
                        this.setState({
                            showResult: true,
                            result,
                        });
                        if (result.userProfit > 0) {
                            this.playSound(sounds.win);
                        } else {
                            this.playSound(sounds.lose);
                        }
                    }, 5000);

                    clearTimeout(this.resultShowTimeoutId);
                    this.resultShowTimeoutId = window.setTimeout(
                        () =>
                            this.setState({
                                showResult: false,
                            }),
                        10000
                    );
                })
                .catch(error => catchError(error));
        } else {
            showErrorMessage(canBet.errorMessage);
        }
    }

    private onValueChange = (value: number) => {
        const {changeValue} = this.props;
        changeValue(value);
    }

    private onRiskChange = (risk: number) => {
        // TODO: as action
        const {wheel, changeNum} = this.props;
        const {num} = wheel;
        const newNum = risk * 100 + (num % 100);
        changeNum(newNum);
    }

    private onSegmentsChange = (segments: number) => {
        // TODO: as action
        const {wheel, changeNum} = this.props;
        const {num} = wheel;
        const newNum = Math.floor(num / 100) * 100 + segments;
        changeNum(newNum);
    }

    private playSound = (audio: HTMLAudioElement) => {
        const {info} = this.props;
        const {sound} = info;

        if (sound) {
            audio.playFromBegin();
        }
    }

    render() {
        const {nightMode, info, gameState, wheel} = this.props;
        const {num, value} = wheel;
        const {result, showResult} = this.state;

        let maxBetValue = maxBet(GameType.WHEEL, num === 0 ? 1 : num, MIN_BANKROLL);
        if (gameState.status !== "ENDED") {
            const max = Math.min(gameState.stake + gameState.balance, maxBetValue);
            maxBetValue = Math.max(max, MIN_BET_VALUE);
        }

        return (
            <Ui
                nightMode={nightMode}
                risk={Math.floor(num / 100)}
                segments={num % 100}
                value={value}
                maxBetValue={maxBetValue}
                onValueChange={this.onValueChange}
                onPlaceBet={this.onPlaceBet}
                onRiskChange={this.onRiskChange}
                onSegmentsChange={this.onSegmentsChange}
                showResult={showResult}
                result={{...result}}
                showHelp={info.showHelp}
                onToggleHelp={this.onToggleHelp}
            />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Wheel);
