import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";

import {Button, FontAwesomeIcon} from "../../../../reusable/index";

import * as Style from "./OpenButton.scss";

export interface Props extends WithTranslation {
    onOpen(): void;
}

const OpenButton = ({onOpen, t}: Props) => (
    <Button color="primary" className={Style.openButton + " d-none d-md-block"} onClick={onOpen}>
        <FontAwesomeIcon icon="comments" /> {t("openChat")}
    </Button>
);

export default withTranslation()(OpenButton);
