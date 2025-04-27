import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";

import {Button, Container} from "../../../reusable";

import * as Style from "./Overview.scss";

export interface Props extends WithTranslation {
    loggedIn: boolean;
    showRegisterModal(): void;
}

const Overview = ({loggedIn, showRegisterModal, t}: Props) => (
    <div className={Style.overview}>
        <Container>
            {!loggedIn && (
                <div className={Style.jumbotron + " rounded px-3 px-sm-4 py-3 py-sm-5"}>
                    <h1>{t("theStateChannelCasino")}</h1>

                    <Button color="primary" size="lg" onClick={showRegisterModal}>
                        {t("JoinNow")}
                    </Button>

                    <span className={Style.info}>{t("noDetailsRequired")}</span>
                </div>
            )}
        </Container>
    </div>
);

export default withTranslation()(Overview);
