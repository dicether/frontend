import * as React from "react";

import {MAX_BET_VALUE, MIN_BET_VALUE} from "../../../../config/config";
import {Ether} from "../../../../reusable/index";
import HowToPlayBase from "../../reusable/HowToPlayBase";

const HowToPlay = () => (
    <HowToPlayBase>
        <h5>Keno</h5>
        <h6>Step1</h6>
        <p>
            Choose your bet amount (between <Ether gwei={MIN_BET_VALUE} precision={5} /> and{" "}
            <Ether gwei={MAX_BET_VALUE} precision={5} /> ETH).
        </p>
        <h6>Step2</h6>
        <p>Select the numbers. You can select between 1 to 10 different numbers</p>
        <h6>Step 3</h6>
        <p>Click the bet button. If your numbers get hit you win. More hits: Higher payout!</p>
    </HowToPlayBase>
);

export default HowToPlay;
