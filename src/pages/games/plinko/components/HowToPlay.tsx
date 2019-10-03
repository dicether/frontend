import * as React from "react";
import {Ether} from "../../../../reusable/index";

import {MAX_BET_VALUE, MIN_BET_VALUE} from "../../../../config/config";
import HowToPlayBase from "../../reusable/HowToPlayBase";

const HowToPlay = () => (
    <HowToPlayBase>
        <h5>Plinko</h5>
        <h6>Step1</h6>
        <p>
            Choose your bet amount (between <Ether gwei={MIN_BET_VALUE} precision={5} /> and{" "}
            <Ether gwei={MAX_BET_VALUE} precision={5} /> ETH).
        </p>
        <h6>Step2</h6>
        <p>Select the number of rows and the risk.</p>
        <h6>Step 3</h6>
        <p>Drop the ball!</p>
    </HowToPlayBase>
);

export default HowToPlay;
