import {GameType, maxBet} from "@dicether/state-channel";
import * as React from "react";

import {KELLY_FACTOR, MIN_BANKROLL, MIN_BET_VALUE} from "../../../../config/config";
import {Ether} from "../../../../reusable/index";
import HowToPlayBase from "../../reusable/HowToPlayBase";

const HowToPlay = () => (
    <HowToPlayBase>
        <h5>Flip a coin</h5>
        <h6>Step1</h6>
        <p>
            Choose your bet amount (between <Ether gwei={MIN_BET_VALUE} precision={5} /> and{" "}
            <Ether gwei={maxBet(GameType.FLIP_A_COIN, 0, MIN_BANKROLL, KELLY_FACTOR)} precision={5} /> ETH).
        </p>
        <h6>Step2</h6>
        <p>Choose heads or tails.</p>
        <h6>Step 3</h6>
        <p>
            Click the <em>Flip the Coin</em> button. If you have chosen the correct side, you have won!
        </p>
    </HowToPlayBase>
);

export default HowToPlay;
