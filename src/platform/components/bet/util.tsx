import {GameType} from "@dicether/state-channel";

export function gameTypeToName(gameType: number) {
    switch (gameType) {
        case GameType.DICE_LOWER:
        case GameType.DICE_HIGHER:
            return "Dice";
        case GameType.CHOOSE_FROM_12:
            return "Choose From 12";
        case GameType.FLIP_A_COIN:
            return "Flip A Coin";
        case GameType.KENO:
            return "Keno";
        case GameType.WHEEL:
            return "Wheel";
        default:
            return "Unknown";
    }
}

export function gameTypeToLink(gameType: number) {
    switch (gameType) {
        case GameType.DICE_LOWER:
        case GameType.DICE_HIGHER:
            return "/games/dice";
        case GameType.CHOOSE_FROM_12:
            return "/games/chooseFrom12";
        case GameType.FLIP_A_COIN:
            return "/games/flipACoin";
        case GameType.KENO:
            return "/games/keno";
        case GameType.WHEEL:
            return "/games/wheel";
        default:
            return "/unknown";
    }
}
