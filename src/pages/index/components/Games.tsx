import {TFunction} from "i18next";
import * as React from "react";
import {withTranslation} from "react-i18next";
import {Link} from "react-router-dom";

import {Container, Section} from "../../../reusable";

const DiceLogo = require("assets/images/diceLogo.svg");
const ChooseFrom12Logo = require("assets/images/chooseFrom12Logo.svg");
// const Question = require("assets/images/question.svg");
const FlipACoinLogo = require("assets/images/flipACoinLogo.svg");
const KenoLogo = require("assets/images/kenoLogo.svg");
const PlinkoLogo = require("assets/images/plinkoLogo.svg");
const WheelLogo = require("assets/images/wheelLogo.svg");

const Style = require("./Games.scss");

const Games = ({t}: {t: TFunction}) => (
    <Section className={Style.games}>
        <Container>
            <h2 className="text-center">Games</h2>
            <div className={Style.gamesList}>
                <Link to="/games/dice" className={Style.gameLink + " " + Style.gameLink_active}>
                    <img src={DiceLogo} className={Style.img} />
                    <h5 className={Style.text}>{t("ClassicDice")}</h5>
                </Link>
                <Link to="/games/chooseFrom12" className={Style.gameLink + " " + Style.gameLink_active}>
                    <img src={ChooseFrom12Logo} className={Style.img} />
                    <h5 className={Style.text}>{t("ChooseFrom12")}</h5>
                </Link>
                <Link to="/games/flipACoin" className={Style.gameLink + " " + Style.gameLink_active}>
                    <img src={FlipACoinLogo} className={Style.img} />
                    <h5 className={Style.text}>{t("FlipACoin")}</h5>
                </Link>
            </div>
            <div className={Style.gamesList}>
                <Link to="/games/keno" className={Style.gameLink + " " + Style.gameLink_active}>
                    <img src={KenoLogo} className={Style.img} />
                    <h5 className={Style.text}>{t("Keno")}</h5>
                </Link>
                <Link to="/games/wheel" className={Style.gameLink + " " + Style.gameLink_active}>
                    <img src={WheelLogo} className={Style.img} />
                    <h5 className={Style.text}>Wheel</h5>
                </Link>
                <Link to="/games/plinko" className={Style.gameLink + " " + Style.gameLink_active}>
                    <img src={PlinkoLogo} className={Style.img} />
                    <h5 className={Style.text}>{t("Plinko")}</h5>
                </Link>
            </div>
        </Container>
    </Section>
);

export default withTranslation()(Games);
