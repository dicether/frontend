import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import {Jumbotron} from "reactstrap";

import {Button, Container} from "../../../reusable";

import Style from "./Overview.scss";

export interface Props extends WithTranslation {
    loggedIn: boolean;
    showRegisterModal(): void;
}

const Overview = ({loggedIn, showRegisterModal, t}: Props) => (
    <div className={Style.overview}>
        <Container>
            <Jumbotron className={Style.jumbotron}>
                <h1>{t("theStateChannelCasino")}</h1>
                {!loggedIn && (
                    <Button color="primary" size="lg" onClick={showRegisterModal}>
                        {t("JoinNow")}
                    </Button>
                )}
                <span className={Style.info}>{t("noDetailsRequired")}</span>
            </Jumbotron>
        </Container>
    </div>
);

export default withTranslation()(Overview);
