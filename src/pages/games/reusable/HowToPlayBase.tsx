import * as React from "react";

import {MAX_GAME_SESSION_VALUE, MIN_GAME_SESSION_VALUE} from "../../../config/config";
import {Ether} from "../../../reusable";

const Style = require("./HowToPlayBase.scss");

export type Props = {
    children: React.ReactNode;
};

const HowToPlayBase = ({children}: Props) => (
    <div className={Style.howToPlay}>
        <h3 className="text-center">How to play?</h3>
        <h5>Start game session</h5>
        <p>
            Press <em>Start Game Session</em> and deposit your desired amount of Ether (between{" "}
            <Ether gwei={MIN_GAME_SESSION_VALUE} precision={2} />
            and <Ether gwei={MAX_GAME_SESSION_VALUE} precision={2} /> ETH).
        </p>
        {children}
        <h5>End game session</h5>
        <p>
            Click <em>End Game Session</em> to receive your profit.
        </p>
    </div>
);

export default HowToPlayBase;
