import * as React from "react";
import {WithNamespaces, withNamespaces} from "react-i18next";

import {Button, FontAwesomeIcon} from "../../../../reusable/index";

const Style = require("./OpenButton.scss");

export interface Props extends WithNamespaces {
    onOpen(): void;
}

const OpenButton = ({onOpen, t}: Props) => (
    <Button color="primary" className={Style.openButton + " d-none d-md-block"} onClick={onOpen}>
        <FontAwesomeIcon icon="comments" /> {t("openChat")}
    </Button>
);

export default withNamespaces()(OpenButton);
