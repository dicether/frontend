import {MIN_BET_VALUE, NETWORK_NAME} from "../../config/config";
import {State as GameState} from "../../platform/modules/games/state/reducer";

function returnError(errorMessage: string) {
    return {canPlaceBet: false, errorMessage};
}

export function canPlaceBet(
    gameType: number,
    num: number,
    betValue: number,
    loggedIn: boolean,
    web3Available: boolean,
    gameState: GameState
) {
    if (!loggedIn) {
        return returnError("You need to login before playing!");
    }

    if (!web3Available) {
        return returnError(
            "You need to have a web3 enabled browser (e.g. install Metamask, use Trust Wallet or Coinbase Wallet)" +
                `for playing and select network: ${NETWORK_NAME}!`
        );
    }

    if (gameState.status === "ENDED") {
        return returnError("You need to create a game session before playing!");
    }

    if (gameState.status === "PLACED_BET") {
        return returnError(
            "Your seed isn't revealed! Should normally work without your interaction." +
                ' To manually reveal it You can click "request seed"!'
        );
    }

    if (gameState.status !== "ACTIVE") {
        return returnError("Can not place bet! You game session must be active to create bets!");
    }

    if (gameState.stake + gameState.balance < MIN_BET_VALUE) {
        return returnError("You funds are to low! You need to end the game session and start a new one!");
    }

    return {canPlaceBet: true, errorMessage: ""};
}
