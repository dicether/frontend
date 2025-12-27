import {GameType, maxBet} from "@dicether/state-channel";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Helmet} from "react-helmet";
import {useSelector} from "react-redux";

import {KELLY_FACTOR, MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
import {addNewBet} from "../../../platform/modules/bets/asyncActions";
import {toggleHelp} from "../../../platform/modules/games/info/actions";
import {placeBet, validChainId} from "../../../platform/modules/games/state/asyncActions";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";
import {catchError} from "../../../platform/modules/utilities/asyncActions";
import {State} from "../../../rootReducer";
import sounds from "../sound";
import {canPlaceBet} from "../utilities";
import {changeNum, changeValue} from "./actions";
import Ui from "./components/Ui";
import {playFromBegin} from "../../../util/audio";
import {useDispatch} from "../../../util/util";

const Wheel = () => {
    const loadedSounds = useRef(false);
    const resultShowTimeoutId = useRef(0);
    const resultUntilShowTimeoutId = useRef(0);

    const [spinning, setSpinning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState({betNum: 0, num: 0, won: false, userProfit: 0});

    useEffect(() => {
        return () => {
            clearTimeout(resultShowTimeoutId.current);
            clearTimeout(resultUntilShowTimeoutId.current);
        };
    }, []);

    const {web3Available, gameState, info, wheel, loggedIn, nightMode} = useSelector(
        ({app, games, account, web3}: State) => {
            const {gameState, info, wheel} = games;
            const web3Available = web3.account && web3.contract && web3.web3 && validChainId(web3.chainId);

            return {
                web3Available: web3Available === true,
                gameState,
                info,
                wheel,
                loggedIn: account.jwt !== null,
                nightMode: app.nightMode,
            };
        },
    );

    const dispatch = useDispatch();

    useEffect(() => {
        // if the balance changes, we need to check if user has enough funds for current bet value
        const leftStake = gameState.stake + gameState.balance;
        if (wheel.value > leftStake) {
            dispatch(changeValue(Math.max(leftStake, MIN_BET_VALUE)));
        }
    }, [gameState.balance, gameState.stake, wheel.value]);

    const onToggleHelp = () => {
        dispatch(toggleHelp(!info.showHelp));
    };

    const onPlaceBet = () => {
        const safeBetValue = Math.round(wheel.value);
        const num = wheel.num;
        const gameType = GameType.WHEEL;

        if (!loadedSounds.current) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.win.load();
            sounds.lose.load();
            sounds.menuDown.load();
            loadedSounds.current = true;
        }

        if (num === 0) {
            return;
        }

        const canBet = canPlaceBet(gameType, num, safeBetValue, loggedIn, web3Available, gameState);
        if (canBet.canPlaceBet) {
            setShowResult(false);
            dispatch(placeBet(num, safeBetValue, gameType))
                .then((result) => {
                    setSpinning(true);
                    setResult(result);
                    clearTimeout(resultUntilShowTimeoutId.current);
                    resultUntilShowTimeoutId.current = window.setTimeout(() => {
                        dispatch(addNewBet(result.bet));
                        setSpinning(false);
                        setShowResult(true);
                        setResult(result);
                    }, 5000);

                    clearTimeout(resultShowTimeoutId.current);
                    resultShowTimeoutId.current = window.setTimeout(() => {
                        if (result.userProfit > 0) {
                            playSound(sounds.win);
                        } else {
                            playSound(sounds.lose);
                        }
                    }, 5000);

                    clearTimeout(resultShowTimeoutId.current);
                    resultShowTimeoutId.current = window.setTimeout(() => setShowResult(false), 10000);
                })
                .catch((error) => catchError(error, dispatch));
        } else {
            dispatch(showErrorMessage(canBet.errorMessage));
        }
    };

    const onValueChange = (value: number) => {
        dispatch(changeValue(value));
    };

    const onRiskChange = (risk: number) => {
        // TODO: as action
        const {num} = wheel;
        const newNum = risk * 100 + (num % 100);
        dispatch(changeNum(newNum));
    };

    const onSegmentsChange = (segments: number) => {
        // TODO: as action
        const {num} = wheel;
        const newNum = Math.floor(num / 100) * 100 + segments;
        dispatch(changeNum(newNum));
    };

    const playSound = (audio: HTMLAudioElement) => {
        const {sound} = info;

        if (sound) {
            playFromBegin(audio);
        }
    };

    const {num, value} = wheel;
    let maxBetValue = maxBet(GameType.WHEEL, num === 0 ? 1 : num, MIN_BANKROLL, KELLY_FACTOR);
    if (gameState.status !== "ENDED") {
        const max = Math.min(gameState.stake + gameState.balance, maxBetValue);
        maxBetValue = Math.max(max, MIN_BET_VALUE);
    }

    return (
        <>
            <Helmet>
                <title>Wheel - Dicether</title>
                <meta name="description" content="Ethereum state channel based Wheel game" />
            </Helmet>
            <Ui
                nightMode={nightMode}
                risk={Math.floor(num / 100)}
                segments={num % 100}
                value={value}
                maxBetValue={maxBetValue}
                onValueChange={onValueChange}
                onPlaceBet={onPlaceBet}
                onRiskChange={onRiskChange}
                onSegmentsChange={onSegmentsChange}
                showResult={showResult}
                disableRiskSegmentUpdate={spinning}
                result={{...result}}
                showHelp={info.showHelp}
                onToggleHelp={onToggleHelp}
            />
        </>
    );
};

export default Wheel;
