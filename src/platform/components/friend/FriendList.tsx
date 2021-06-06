import ClassNames from "classnames";
import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";

import {Friend} from "../../modules/friends/types";

import Style from "./FriendList.scss";

export interface Props extends WithTranslation {
    friends: Friend[];
}

const FriendList = ({friends, t}: Props) => {
    const friendsOnline = friends.filter((friend) => friend.online);
    const friendsOffline = friends.filter((friend) => !friend.online);

    const onlineFriendClass = ClassNames(Style.onlineStatus, Style.onlineStatus_online);
    const offlineFriendClass = ClassNames(Style.onlineStatus, Style.onlineStatus_offline);

    return (
        <div>
            <h5>
                {t("friendsOnline")} ({friendsOnline.length})
            </h5>
            <ul className={Style.list}>
                {friendsOnline.map((friend) => (
                    <li className={Style.friend} key={friend.user.address}>
                        <span className={onlineFriendClass} />
                        {friend.user.username}
                    </li>
                ))}
            </ul>
            <h5>
                {t("friendsOffline")} ({friendsOffline.length})
            </h5>
            <ul className={Style.list}>
                {friendsOffline.map((friend) => (
                    <li className={Style.friend} key={friend.user.address}>
                        <div className={offlineFriendClass} />
                        {friend.user.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default withTranslation()(FriendList);
