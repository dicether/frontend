import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import {Link} from "react-router-dom";

import {Container, Section} from "../../../reusable";

import * as Style from "./Games.scss";
import ChooseFrom12Logo from "assets/images/chooseFrom12Logo.svg";
import DiceLogo from "assets/images/diceLogo.svg";
// import Question from "assets/images/question.svg";
import FlipACoinLogo from "assets/images/flipACoinLogo.svg";
import KenoLogo from "assets/images/kenoLogo.svg";
import PlinkoLogo from "assets/images/plinkoLogo.svg";
import WheelLogo from "assets/images/wheelLogo.svg";

const Games = ({t}: WithTranslation) => (
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
