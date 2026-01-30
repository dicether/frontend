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
import {useEffect, useRef, useState} from "react";
import {Helmet} from "react-helmet";
import {useSelector} from "react-redux";

import {KELLY_FACTOR, MIN_BANKROLL, MIN_BET_VALUE} from "../../../config/config";
import {useIsConnected} from "../../../hooks/useIsConnected";
import {addNewBet} from "../../../platform/modules/bets/asyncActions";
import {toggleHelp} from "../../../platform/modules/games/info/actions";
import {placeBet} from "../../../platform/modules/games/state/asyncActions";
import {showErrorMessage} from "../../../platform/modules/utilities/actions";
import {catchError} from "../../../platform/modules/utilities/asyncActions";
import {State} from "../../../rootReducer";
import {getRandomInt, shuffle} from "../../../util/math";
import {useDispatch} from "../../../util/util";
import sounds from "../sound";
import {canPlaceBet} from "../utilities";
import {changeNum, changeValue} from "./actions";
import Ui from "./components/Ui";
import {playFromBegin} from "../../../util/audio";

interface Result {
    betNum: number;
    num: number;
    won: boolean;
    userProfit: number;
}

const Keno = () => {
    const loadedSounds = useRef(false);
    const pickTimeoutId = useRef(0);
    const resultTimeoutId = useRef(0);

    const [showResult, setShowResult] = useState(false);
    const [tmpResult, setTmpResult] = useState({betNum: 0, num: 0, won: false, userProfit: 0});
    const [showResultProfit, setShowResultProfit] = useState(false);

    useEffect(() => {
        return () => {
            clearTimeout(pickTimeoutId.current);
            clearTimeout(resultTimeoutId.current);
        };
    }, []);

    const gameState = useSelector((state: State) => state.games.gameState);
    const info = useSelector((state: State) => state.games.info);
    const keno = useSelector((state: State) => state.games.keno);
    const loggedIn = useSelector((state: State) => state.account.jwt !== null);

    const dispatch = useDispatch();

    const isConnected = useIsConnected();

    useEffect(() => {
        // if the balance changes, we need to check if user has enough funds for current bet value
        const leftStake = gameState.stake + gameState.balance;
        if (keno.value > leftStake) {
            changeValue(Math.max(leftStake, MIN_BET_VALUE));
        }
    }, [gameState.stake, gameState.balance, keno.value]);

    const onToggleHelp = () => {
        toggleHelp(!info.showHelp);
    };

    const onValueChange = (value: number) => {
        changeValue(value);
    };

    const onClick = (tile: number) => {
        const {num} = keno;

        if (showResult) {
            return;
        }

        const newNum = new BN(num).xor(new BN(1).shln(tile)).toNumber();
        playSound(sounds.tileSelect);
        dispatch(changeNum(newNum));
    };

    const onAutoPickHelper = (num: number) => {
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
        dispatch(changeNum(newNum));
        playSound(sounds.tileSelect);

        pickTimeoutId.current = window.setTimeout(() => onAutoPickHelper(newNum), 100);
    };

    const onAutoPick = () => {
        onAutoPickHelper(0);
    };

    const onClear = () => {
        dispatch(changeNum(0));
    };

    const onPlaceBet = () => {
        const safeBetValue = Math.round(keno.value);
        const num = keno.num;
        const gameType = GameType.KENO;

        if (!loadedSounds.current) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.tileHit.load();
            sounds.tileMiss.load();
            sounds.tileSelect.load();
            loadedSounds.current = true;
        }

        if (num === 0) {
            return;
        }

        const canBet = canPlaceBet(gameType, num, safeBetValue, loggedIn, isConnected, gameState);
        if (canBet.canPlaceBet) {
            dispatch(placeBet(num, safeBetValue, gameType))
                .then((result) => {
                    setShowResult(true);
                    setTmpResult({...result, num: 0});
                    clearTimeout(resultTimeoutId.current);
                    resultTimeoutId.current = window.setTimeout(() => {
                        setShowResult(false);
                        setShowResultProfit(false);
                    }, 5000);

                    dispatch(addNewBet(result.bet));
                    showKenoResult(result);
                })
                .catch((error) => catchError(error, dispatch));
        } else {
            showErrorMessage(canBet.errorMessage);
        }
    };

    const showResultHelper = (indices: number[], betNum: number, curNum: number) => {
        if (indices.length === 0) {
            return;
        }

        const idx = indices[0];
        const newBit = new BN(1).shln(idx);
        const newTmpResult = new BN(curNum).or(newBit).toNumber();

        setTmpResult((prevTmpResult) => ({
            ...prevTmpResult,
            num: newTmpResult,
        }));

        if (newBit.and(new BN(betNum)).toNumber() !== 0) {
            playSound(sounds.tileHit);
        } else {
            playSound(sounds.tileMiss);
        }

        indices.shift();

        if (indices.length === 0) {
            window.setTimeout(() => setShowResultProfit(true), 300);
        } else {
            window.setTimeout(showResultHelper, 300, indices, betNum, newTmpResult);
        }
    };

    const showKenoResult = (result: Result) => {
        const {num} = result;
        const resultTiles = getSetBits(num);

        const indices = resultTiles.map((x, i) => (x ? i : -1)).filter((idx) => idx !== -1);
        shuffle(indices);
        showResultHelper(indices, result.betNum, 0);
    };

    const playSound = (audio: HTMLAudioElement) => {
        const {sound} = info;

        if (sound) {
            playFromBegin(audio);
        }
    };

    const {num, value} = keno;

    let maxBetValue = maxBet(GameType.KENO, num === 0 ? 1 : num, MIN_BANKROLL, KELLY_FACTOR);
    if (gameState.status !== "ENDED") {
        const max = Math.min(gameState.stake + gameState.balance, maxBetValue);
        maxBetValue = Math.max(max, MIN_BET_VALUE);
    }

    return (
        <>
            <Helmet>
                <title>Keno - Dicether</title>
                <meta name="description" content="Ethereum state channel based keno game" />
            </Helmet>
            <Ui
                num={num}
                value={value}
                maxBetValue={maxBetValue}
                onValueChange={onValueChange}
                onClick={onClick}
                onAutoPick={onAutoPick}
                onClear={onClear}
                onPlaceBet={onPlaceBet}
                showResult={showResult}
                showResultProfit={showResultProfit}
                result={tmpResult}
                showHelp={info.showHelp}
                onToggleHelp={onToggleHelp}
            />
        </>
    );
};

export default Keno;
