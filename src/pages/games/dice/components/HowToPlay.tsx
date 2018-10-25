import * as React from "react";
import {Ether} from "../../../../reusable/index";

import {MAX_BET_VALUE, MIN_BET_VALUE} from "../../../../config/config";
import HowToPlayBase from "../../reusable/HowToPlayBase";

const HowToPlay = () => (
    <HowToPlayBase>
        <h5>Roll the dice</h5>
        <h6>Step1</h6>
        <p>
            Choose your bet amount (between <Ether gwei={MIN_BET_VALUE} precision={5} /> and{" "}
            <Ether gwei={MAX_BET_VALUE} precision={5} /> ETH).
        </p>
        <h6>Step2</h6>
        <p>Adjust the slider for higher or lower win reward.</p>
        <h6>Step 3</h6>
        <p>Click Roll Dice. If the roll is in the green region, you win!</p>
    </HowToPlayBase>
);

export default HowToPlay;
