import {GameType, maxBet} from "@dicether/state-channel";
import * as React from "react";
import {useEffect} from "react";
import {Helmet} from "react-helmet";
import {useSelector} from "react-redux";

import {KELLY_FACTOR, MAX_BET_VALUE, MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
import {useIsConnected} from "../../../hooks/useIsConnected";
import {addNewBet} from "../../../platform/modules/bets/asyncActions";
import {toggleHelp} from "../../../platform/modules/games/info/actions";
import {placeBet} from "../../../platform/modules/games/state/asyncActions";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";
import {catchError} from "../../../platform/modules/utilities/asyncActions";
import {State} from "../../../rootReducer";
import {useDispatch} from "../../../util/util";
import sounds from "../sound";
import {canPlaceBet} from "../utilities";
import {changeNum, changeValue} from "./actions";
import Ui from "./components/Ui";
import {playFromBegin} from "../../../util/audio";

const ChooseFrom12 = () => {
    const loadedSounds = React.useRef(false);
    const resultTimeoutId = React.useRef(0);
    const [showResult, setShowResult] = React.useState(false);
    const [result, setResult] = React.useState({num: 0, won: false});

    React.useEffect(() => {
        return () => {
            clearTimeout(resultTimeoutId.current);
        };
    }, []);

    useEffect(() => {
        return () => {
            clearTimeout(resultTimeoutId.current);
        };
    }, []);

    const {gameState, info, oneDice, loggedIn} = useSelector(({games, account}: State) => {
        const {info, oneDice, gameState} = games;

        return {
            info,
            oneDice,
            gameState,
            loggedIn: account.jwt !== null,
        };
    });

    useEffect(() => {
        // if the balance changes, we need to check if user has enough funds for current bet value
        const leftStake = gameState.stake + gameState.balance;
        if (oneDice.value > leftStake) {
            changeValue(Math.max(leftStake, MIN_BET_VALUE));
        }
    }, [gameState.stake, gameState.balance, oneDice.value]);

    const dispatch = useDispatch();

    const isConnected = useIsConnected();

    const onToggleHelp = () => {
        dispatch(toggleHelp(!info.showHelp));
    };

    const onValueChange = (value: number) => {
        dispatch(changeValue(value));
    };

    const onClick = (diceNum: number) => {
        const {num} = oneDice;

        if (showResult && result.num === diceNum) {
            setShowResult(false);
        }

        const newNum = (1 << diceNum) ^ num;
        if (info.sound) {
            playFromBegin(sounds.tileSelect);
        }
        dispatch(changeNum(newNum));
    };

    const onPlaceBet = () => {
        const safeBetValue = Math.round(oneDice.value);
        const num = oneDice.num;
        const gameType = GameType.CHOOSE_FROM_12;

        if (!loadedSounds.current) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.win.load();
            sounds.lose.load();
            loadedSounds.current = true;
        }

        const canBet = canPlaceBet(gameType, num, safeBetValue, loggedIn, isConnected, gameState);
        if (canBet.canPlaceBet) {
            dispatch(placeBet(num, safeBetValue, gameType))
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

    const {num, value} = oneDice;

    let maxBetValue = Math.min(maxBet(GameType.CHOOSE_FROM_12, num, MIN_BANKROLL, KELLY_FACTOR), MAX_BET_VALUE);
    if (gameState.status !== "ENDED") {
        const max = Math.min(gameState.stake + gameState.balance, maxBetValue);
        maxBetValue = Math.max(max, MIN_BET_VALUE);
    }

    return (
        <>
            <Helmet>
                <title>Choose from 12 - Dicether</title>
                <meta name="description" content="Ethereum state channel based Choose from 12 game" />
            </Helmet>
            <Ui
                num={num}
                value={value}
                maxBetValue={maxBetValue}
                onValueChange={onValueChange}
                onClick={onClick}
                onPlaceBet={onPlaceBet}
                showResult={showResult}
                result={result}
                showHelp={info.showHelp}
                onToggleHelp={onToggleHelp}
            />
        </>
    );
};

export default ChooseFrom12;
