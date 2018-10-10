import * as React from "react";
import {Link} from "react-router-dom";

import {Container, Section} from "../../../reusable";

const DiceLogo = require("assets/images/diceLogo.svg");
const ChooseFrom12Logo = require("assets/images/chooseFrom12Logo.svg");
const Question = require("assets/images/question.svg");

const Style = require("./Games.scss");

const Games = () => (
    <Section className={Style.games}>
        <Container>
            <h2 className="text-center">Games</h2>
            <div className={Style.gamesList}>
                <Link to="/games/dice" className={Style.gameLink + " " + Style.gameLink_active}>
                    <img src={DiceLogo} className={Style.img} />
                    <h5 className={Style.text}>Classic Dice</h5>
                </Link>
                <Link to="/games/chooseFrom12" className={Style.gameLink + " " + Style.gameLink_active}>
                    <img src={ChooseFrom12Logo} className={Style.img} />
                    <h5 className={Style.text}>Choose from 12</h5>
                </Link>
                <div className={Style.gameLink + " " + Style.gameLink_disabled}>
                    <img src={Question} className={Style.img} />
                    <h5 className={Style.text}>More Coming Soon</h5>
                </div>
            </div>
        </Container>
    </Section>
);

export default Games;
