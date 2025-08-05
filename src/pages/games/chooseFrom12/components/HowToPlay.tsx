import {GameType, maxBet} from "@dicether/state-channel";
import * as React from "react";

import {KELLY_FACTOR, MIN_BANKROLL, MIN_BET_VALUE} from "../../../../config/config";
import {Ether} from "../../../../reusable/index";
import HowToPlayBase from "../../reusable/HowToPlayBase";

const HowToPlay = () => (
    <HowToPlayBase>
        <h5>Choose from 12 numbers</h5>
        <h6>Step1</h6>
        <p>
            Choose your bet amount (between <Ether gwei={MIN_BET_VALUE} precision={5} /> and{" "}
            <Ether
                gwei={maxBet(GameType.CHOOSE_FROM_12, Math.pow(2, 11) - 1, MIN_BANKROLL, KELLY_FACTOR)}
                precision={5}
            />{" "}
            ETH).
        </p>
        <h6>Step2</h6>
        <p>Select the numbers. You can select between 1 to 11 different numbers</p>
        <h6>Step 3</h6>
        <p>Click the bet button. If the result is one of your selected numbers, you win!</p>
    </HowToPlayBase>
);

export default HowToPlay;
