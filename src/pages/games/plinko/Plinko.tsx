import {GameType, maxBet} from "@dicether/state-channel";
import * as React from "react";
import {Helmet} from "react-helmet";
import {connect} from "react-redux";

import {KELLY_FACTOR, MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
import {addNewBet} from "../../../platform/modules/bets/asyncActions";
import {Bet} from "../../../platform/modules/bets/types";
import {toggleHelp} from "../../../platform/modules/games/info/actions";
import {placeBet, validChainId} from "../../../platform/modules/games/state/asyncActions";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";
import {catchError} from "../../../platform/modules/utilities/asyncActions";
import {State} from "../../../rootReducer";
import {popCnt} from "../../../util/math";
import {sleep} from "../../../util/time";
import {Dispatch} from "../../../util/util";
import sounds from "../sound";
import {canPlaceBet} from "../utilities";
import {changeNum, changeValue} from "./actions";
import Ui from "./components/Ui";
import {playFromBegin} from "../../../util/audio";

const mapStateToProps = ({games, account, web3, app}: State) => {
    const {info, gameState, plinko} = games;
    const web3Available = web3.account && web3.contract && web3.web3 && validChainId(web3.chainId);

    return {
        web3Available: web3Available === true,
        info,
        gameState,
        loggedIn: account.jwt !== null,
        plinko,
        nightMode: app.nightMode,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    placeBet: (num: number, value: number, gameType: number) => dispatch(placeBet(num, value, gameType)),
    addNewBet: (bet: Bet) => dispatch(addNewBet(bet)),
    changeNum: (num: number) => dispatch(changeNum(num)),
    changeValue: (value: number) => dispatch(changeValue(value)),
    toggleHelp: (t: boolean) => dispatch(toggleHelp(t)),
    showErrorMessage: (message: string) => dispatch(showErrorMessage(message)),
    catchError: (error: unknown) => catchError(error, dispatch),
});

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export interface PlinkoState {
    showResult: boolean;
    ballsFalling: number;
    result: {betNum: number; num: number; won: boolean; userProfit: number};
}

class Plinko extends React.PureComponent<Props, PlinkoState> {
    private loadedSounds = false;

    public ui = React.createRef<any>();

    constructor(props: Props) {
        super(props);
        this.state = {
            showResult: false,
            ballsFalling: 0,
            result: {betNum: 0, num: 0, won: false, userProfit: 0},
        };
    }

    public componentDidUpdate(prevProps: Props) {
        const {gameState, plinko, changeValue} = this.props;

        if (gameState.balance !== prevProps.gameState.balance) {
            // if the balance changes, we need to check if user has enough funds for current bet value
            const leftStake = gameState.stake + gameState.balance;
            if (plinko.value > leftStake) {
                changeValue(Math.max(leftStake, MIN_BET_VALUE));
            }
        }
    }

    private onToggleHelp = () => {
        const {toggleHelp, info} = this.props;
        toggleHelp(!info.showHelp);
    };

    private onPlaceBet = async () => {
        const {plinko, addNewBet, placeBet, catchError, showErrorMessage, web3Available, gameState, loggedIn} =
            this.props;

        const safeBetValue = Math.round(plinko.value);
        const num = plinko.num;
        const gameType = GameType.PLINKO;

        if (!this.loadedSounds) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.plinkoResult.load();
            this.loadedSounds = true;
        }

        const canBet = canPlaceBet(gameType, num, safeBetValue, loggedIn, web3Available, gameState);
        if (canBet.canPlaceBet) {
            try {
                const result = await placeBet(num, safeBetValue, gameType);
                const resultNum = result.num;

                const numBitsSet = popCnt(resultNum);
                this.setState({
                    ballsFalling: this.state.ballsFalling + 1,
                });
                await this.ui.current?.plinko.current?.addBall(numBitsSet, resultNum);
                this.setState({
                    showResult: true,
                    ballsFalling: this.state.ballsFalling - 1,
                    result,
                });
                addNewBet(result.bet);
                this.playSound(sounds.plinkoResult);

                await sleep(5000);
                this.setState({showResult: false});
            } catch (error) {
                catchError(error);
            }
        } else {
            showErrorMessage(canBet.errorMessage);
        }
    };

    private onValueChange = (value: number) => {
        const {changeValue} = this.props;
        changeValue(value);
    };

    private onRiskChange = (risk: number) => {
        // TODO: as action
        const {plinko, changeNum} = this.props;
        const {num} = plinko;
        const newNum = risk * 100 + (num % 100);
        changeNum(newNum);
    };

    private onRowsChange = (segments: number) => {
        // TODO: as action
        const {plinko, changeNum} = this.props;
        const {num} = plinko;
        const newNum = Math.floor(num / 100) * 100 + segments;
        changeNum(newNum);
    };

    private playSound = (audio: HTMLAudioElement) => {
        const {info} = this.props;
        const {sound} = info;

        if (sound) {
            playFromBegin(audio);
        }
    };

    render() {
        const {catchError, nightMode, info, gameState, plinko} = this.props;
        const {num, value} = plinko;
        const {ballsFalling, showResult, result} = this.state;

        let maxBetValue = maxBet(GameType.PLINKO, num, MIN_BANKROLL, KELLY_FACTOR);
        if (gameState.status !== "ENDED") {
            const max = Math.min(gameState.stake + gameState.balance, maxBetValue);
            maxBetValue = Math.max(max, MIN_BET_VALUE);
        }

        return (
            <>
                <Helmet>
                    <title>Plinko - Dicether</title>
                    <meta name="description" content="Ethereum state channel based Plinko game" />
                </Helmet>
                <Ui
                    disableRiskRowUpdate={ballsFalling > 0}
                    ref={this.ui}
                    nightMode={nightMode}
                    risk={Math.floor(num / 100)}
                    rows={num % 100}
                    value={value}
                    maxBetValue={maxBetValue}
                    onValueChange={this.onValueChange}
                    onPlaceBet={() => void this.onPlaceBet().catch(catchError)}
                    onRiskChange={this.onRiskChange}
                    onRowsChange={this.onRowsChange}
                    showResult={showResult}
                    result={{...result}}
                    showHelp={info.showHelp}
                    onToggleHelp={this.onToggleHelp}
                />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Plinko);
