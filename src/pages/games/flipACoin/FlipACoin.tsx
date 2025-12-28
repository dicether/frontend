import {GameType, maxBet} from "@dicether/state-channel";
import * as React from "react";
import {useRef, useState} from "react";
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
import {playFromBegin} from "../../../util/audio";
import {useDispatch} from "../../../util/util";
import sounds from "../sound";
import {canPlaceBet} from "../utilities";
import {changeNum, changeValue} from "./actions";
import Ui from "./components/Ui";

const FlipACoin = () => {
    const resultTimeoutId = useRef(0);
    const loadedSounds = useRef(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState({num: 1, won: false});

    const {gameState, info, flipACoin, loggedIn} = useSelector(({games, account}: State) => {
        const {info, flipACoin, gameState} = games;

        return {
            info,
            flipACoin,
            gameState,
            loggedIn: account.jwt !== null,
        };
    });

    const dispatch = useDispatch();

    const isConnected = useIsConnected();

    const onToggleHelp = () => {
        dispatch(toggleHelp(!info.showHelp));
    };

    const onValueChange = (value: number) => {
        dispatch(changeValue(value));
    };

    const onClick = (num: number) => {
        if (showResult && result.num === num) {
            setShowResult(false);
        }

        const newNum = flipACoin.num === num ? 1 - num : num;
        dispatch(changeNum(newNum));
    };

    const onPlaceBet = () => {
        const {value, num} = flipACoin;

        const safeBetValue = Math.round(value);
        const gameType = GameType.FLIP_A_COIN;

        if (!loadedSounds.current) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.win.load();
            sounds.lose.load();
            loadedSounds.current = true;
        }

        const canBet = canPlaceBet(gameType, num, safeBetValue, loggedIn, isConnected, gameState);
        if (canBet.canPlaceBet) {
            setShowResult(false);
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

    const {num, value} = flipACoin;

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

export default FlipACoin;
