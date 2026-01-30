import {GameType, maxBet} from "@dicether/state-channel";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Helmet} from "react-helmet";
import {useSelector} from "react-redux";

import {KELLY_FACTOR, MAX_BET_VALUE, MIN_BANKROLL, MIN_BET_VALUE, RANGE} from "../../../config/config";
import {useIsConnected} from "../../../hooks/useIsConnected";
import {addNewBet} from "../../../platform/modules/bets/asyncActions";
import {toggleHelp} from "../../../platform/modules/games/info/actions";
import {placeBet} from "../../../platform/modules/games/state/asyncActions";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";
import {catchError} from "../../../platform/modules/utilities/asyncActions";
import {State} from "../../../rootReducer";
import sounds from "../sound";
import {canPlaceBet} from "../utilities";
import {changeNum, changeRollMode, changeValue} from "./actions";
import DiceUi from "./components/DiceUi";
import {playFromBegin} from "../../../util/audio";
import {useDispatch} from "../../../util/util";

const Dice = () => {
    const resultTimeoutId = useRef(0);
    const loadedSounds = useRef(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState({num: 1, won: false});

    useEffect(() => {
        return () => {
            window.clearTimeout(resultTimeoutId.current);
        };
    }, []);

    const gameState = useSelector((state: State) => state.games.gameState);
    const info = useSelector((state: State) => state.games.info);
    const dice = useSelector((state: State) => state.games.dice);
    const loggedIn = useSelector((state: State) => state.account.jwt !== null);

    useEffect(() => {
        // if the balance changes, we need to check if user has enough funds for current bet value
        const leftStake = gameState.stake + gameState.balance;
        if (dice.value > leftStake) {
            changeValue(Math.max(leftStake, MIN_BET_VALUE));
        }
    }, [gameState.stake, gameState.balance, dice.value]);

    const dispatch = useDispatch();

    const isConnected = useIsConnected();

    const onToggleHelp = () => {
        dispatch(toggleHelp(!info.showHelp));
    };

    const onNumberChange = (num: number) => {
        dispatch(changeNum(num));
    };

    const onValueChange = (value: number) => {
        dispatch(changeValue(value));
    };

    const onReverseRoll = () => {
        dispatch(changeRollMode(!dice.reverseRoll));
        dispatch(changeNum(RANGE - 1 - dice.num));
    };

    const onPlaceBet = () => {
        const safeBetValue = Math.round(dice.value);
        const num = dice.num;
        const gameType = dice.reverseRoll ? GameType.DICE_HIGHER : GameType.DICE_LOWER;

        if (!loadedSounds.current) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.win.load();
            sounds.lose.load();
            loadedSounds.current = true;
        }

        const canBet = canPlaceBet(gameType, num, safeBetValue, loggedIn, isConnected, gameState);
        if (canBet.canPlaceBet) {
            dispatch(placeBet(num, safeBetValue, gameType)) // to get the latest num value
                .then((result) => {
                    setResult(result);
                    setShowResult(true);
                    clearTimeout(resultTimeoutId.current);
                    resultTimeoutId.current = window.setTimeout(() => setShowResult(false), 5000);

                    dispatch(addNewBet(result.bet));
                    if (info.sound) {
                        setTimeout(() => (result.won ? playFromBegin(sounds.win) : playFromBegin(sounds.lose)), 500);
                    }
                })
                .catch((error) => catchError(error, dispatch));
        } else {
            dispatch(showErrorMessage(canBet.errorMessage));
        }
    };

    let maxBetValue = Math.min(maxBet(dice.reverseRoll ? 2 : 1, dice.num, MIN_BANKROLL, KELLY_FACTOR), MAX_BET_VALUE);
    if (gameState.status !== "ENDED") {
        const max = Math.min(gameState.stake + gameState.balance, maxBetValue);
        maxBetValue = Math.max(max, MIN_BET_VALUE);
    }

    return (
        <>
            <Helmet>
                <title>Dice - Dicether</title>
                <meta name="description" content="Ethereum state channel based Dice game" />
            </Helmet>
            <DiceUi
                num={dice.num}
                value={dice.value}
                onNumberChange={onNumberChange}
                onValueChange={onValueChange}
                onReverseRoll={onReverseRoll}
                onPlaceBet={onPlaceBet}
                reverseRoll={dice.reverseRoll}
                result={result}
                showResult={showResult}
                sound={info.sound}
                showHelp={info.showHelp}
                onToggleHelp={onToggleHelp}
                maxBetValue={maxBetValue}
            />
        </>
    );
};

export default Dice;
