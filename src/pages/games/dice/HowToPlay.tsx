import * as React from 'react';
import {Ether} from '../../../reusable';

const Style = require('./HowToPlay.scss');
import {MAX_BET_VALUE, MAX_GAME_SESSION_VALUE, MIN_BET_VALUE, MIN_GAME_SESSION_VALUE} from '../../../config/config';

const HowToPlay = () => (
    <div className={Style.howToPlay}>
        <h3 className="text-center">How to play?</h3>
        <h5>Start game session</h5>
        <p>
            Press <em>Start Game Session</em> and deposit your desired amount of Ether
            (between <Ether gwei={MIN_GAME_SESSION_VALUE} precision={2}/>
            and <Ether gwei={MAX_GAME_SESSION_VALUE} precision={2}/> ETH).
        </p>
        <h5>Roll dice</h5>
        <h6>Step1</h6>
        <p>
            Choose your bet amount (between <Ether gwei={MIN_BET_VALUE} precision={5}/>
            and <Ether gwei={MAX_BET_VALUE} precision={5}/> ETH).
        </p>
        <h6>Step2</h6>
        <p>
            Adjust the slider for higher or lower win reward.
        </p>
        <h6>Step 3</h6>
        <p>
            Click Roll Dice. If the roll is in the green region, you win!
        </p>
        <h5>End game session</h5>
        <p>
            Click <em>End Game Session</em> to receive your profit.
        </p>
    </div>
);

export default HowToPlay;
