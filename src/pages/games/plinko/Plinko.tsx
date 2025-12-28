import {GameType, maxBet} from "@dicether/state-channel";
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
import {popCnt} from "../../../util/math";
import {sleep} from "../../../util/time";
import {useDispatch} from "../../../util/util";
import sounds from "../sound";
import {canPlaceBet} from "../utilities";
import {changeNum, changeValue} from "./actions";
import Ui from "./components/Ui";
import {playFromBegin} from "../../../util/audio";

const Plinko = () => {
    const loadedSounds = useRef(false);

    const ui = useRef<any>();

    const [showResult, setShowResult] = useState(false);
    const [ballsFalling, setBallsFalling] = useState(0);
    const [result, setResult] = useState({betNum: 0, num: 0, won: false, userProfit: 0});

    const {gameState, info, nightMode, plinko, loggedIn} = useSelector(({app, games, account}: State) => {
        const {gameState, info, plinko} = games;

        return {
            gameState,
            info,
            plinko,
            nightMode: app.nightMode,
            loggedIn: account.jwt !== null,
        };
    });

    const dispatch = useDispatch();

    const isConnected = useIsConnected();

    useEffect(() => {
        // if the balance changes, we need to check if user has enough funds for current bet value
        const leftStake = gameState.stake + gameState.balance;
        if (plinko.value > leftStake) {
            dispatch(changeValue(Math.max(leftStake, MIN_BET_VALUE)));
        }
    }, [gameState.stake, gameState.balance, plinko.value]);

    useEffect(() => {
        // if the balance changes, we need to check if user has enough funds for current bet value
        const leftStake = gameState.stake + gameState.balance;
        if (plinko.value > leftStake) {
            dispatch(changeValue(Math.max(leftStake, MIN_BET_VALUE)));
        }
    }, [gameState.stake, gameState.balance, plinko.value]);

    const onToggleHelp = () => {
        dispatch(toggleHelp(!info.showHelp));
    };

    const onPlaceBet = async () => {
        const safeBetValue = Math.round(plinko.value);
        const num = plinko.num;
        const gameType = GameType.PLINKO;

        if (!loadedSounds.current) {
            // workaround for sound playback on mobile browsers: load sounds in user gesture handler
            sounds.plinkoResult.load();
            loadedSounds.current = true;
        }

        const canBet = canPlaceBet(gameType, num, safeBetValue, loggedIn, isConnected, gameState);
        if (canBet.canPlaceBet) {
            try {
                const result = await dispatch(placeBet(num, safeBetValue, gameType));
                const resultNum = result.num;

                const numBitsSet = popCnt(resultNum);
                setBallsFalling(ballsFalling + 1);
                await ui.current?.plinko.current?.addBall(numBitsSet, resultNum);
                setShowResult(true);
                setBallsFalling(ballsFalling - 1);
                setResult(result);
                dispatch(addNewBet(result.bet));
                playSound(sounds.plinkoResult);

                await sleep(5000);
                setShowResult(false);
            } catch (error) {
                catchError(error, dispatch);
            }
        } else {
            dispatch(showErrorMessage(canBet.errorMessage));
        }
    };

    const onValueChange = (value: number) => {
        dispatch(changeValue(value));
    };

    const onRiskChange = (risk: number) => {
        // TODO: as action
        const {num} = plinko;
        const newNum = risk * 100 + (num % 100);
        dispatch(changeNum(newNum));
    };

    const onRowsChange = (segments: number) => {
        // TODO: as action
        const {num} = plinko;
        const newNum = Math.floor(num / 100) * 100 + segments;
        dispatch(changeNum(newNum));
    };

    const playSound = (audio: HTMLAudioElement) => {
        const {sound} = info;

        if (sound) {
            playFromBegin(audio);
        }
    };

    const {num, value} = plinko;

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
                ref={ui}
                nightMode={nightMode}
                risk={Math.floor(num / 100)}
                rows={num % 100}
                value={value}
                maxBetValue={maxBetValue}
                onValueChange={onValueChange}
                onPlaceBet={() => void onPlaceBet().catch((error) => catchError(error, dispatch))}
                onRiskChange={onRiskChange}
                onRowsChange={onRowsChange}
                showResult={showResult}
                result={{...result}}
                showHelp={info.showHelp}
                onToggleHelp={onToggleHelp}
            />
        </>
    );
};

export default Plinko;
