import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";

import {FontAwesomeIcon} from "../../../../reusable/index";

import Style from "./Header.scss";

interface Props extends WithTranslation {
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
        <button type="button" className="btn-close" aria-label="Close Chat" onClick={onClose} />
    </div>
);

export default withTranslation()(Header);
