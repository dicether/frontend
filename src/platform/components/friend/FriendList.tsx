import ClassNames from "classnames";
import * as React from "react";
import {Friend} from "../../modules/friends/types";

const Style = require("./FriendList.scss");

type Props = {
    friends: Friend[];
};

const FriendList = ({friends}: Props) => {
    const friendsOnline = friends.filter(friend => friend.online);
    const friendsOffline = friends.filter(friend => !friend.online);

    const onlineFriendClass = ClassNames(Style.onlineStatus, Style.onlineStatus_online);
    const offlineFriendClass = ClassNames(Style.onlineStatus, Style.onlineStatus_offline);

    return (
        <div className={Style.friendList}>
            <h5>Friends Online ({friendsOnline.length})</h5>
            <ul className={Style.list}>
                {friendsOnline.map(friend => (
                    <li className={Style.friend} key={friend.user.address}>
                        <span className={onlineFriendClass} />
                        {friend.user.username}
                    </li>
                ))}
            </ul>
            <h5>Friends Offline ({friendsOffline.length})</h5>
            <ul className={Style.list}>
                {friendsOffline.map(friend => (
                    <li className={Style.friend} key={friend.user.address}>
                        <div className={offlineFriendClass} />
                        {friend.user.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendList;
