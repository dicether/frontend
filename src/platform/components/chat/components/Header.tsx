import * as React from "react";
import {WithNamespaces, withNamespaces} from "react-i18next";

import {FontAwesomeIcon} from "../../../../reusable/index";

const Style = require("./Header.scss");

interface Props extends WithNamespaces {
    onClose(): void;
    onToggleFriends(b: boolean): void;
}

const Header = ({onClose, onToggleFriends, t}: Props) => (
    <div className={Style.header}>
        <span className={Style.toggleFriends} onClick={() => onToggleFriends(true)}>
            <FontAwesomeIcon icon="user-friends" />
        </span>
        <span className={Style.title} onClick={() => onToggleFriends(false)}>
            <FontAwesomeIcon icon="comments" />
            {t("chat")}
        </span>
        <button className={"close"} aria-label="Close Chat" onClick={onClose}>
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
);

export default withNamespaces()(Header);
