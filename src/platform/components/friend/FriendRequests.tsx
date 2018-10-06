import * as React from "react";
import {Button} from "../../../reusable/index";

import {FriendRequest} from "../../modules/friends/types";

const Style = require("./FriendRequests.scss");

type Props = {
    receivedFriendRequests: FriendRequest[];
    sentFriendRequests: FriendRequest[];

    onAcceptFriendRequest(address: string): void;
    onDeclineFriendRequest(address: string): void;
    onCancelFriendRequest(address: string): void;
};

const FriendRequests = ({
    receivedFriendRequests,
    sentFriendRequests,
    onAcceptFriendRequest,
    onDeclineFriendRequest,
    onCancelFriendRequest,
}: Props) => (
    <div className={Style.friendRequests}>
        <h5>Sent friend requests ({sentFriendRequests.length})</h5>
        <ul className={Style.list}>
            {sentFriendRequests.map(friendRequest => (
                <li className={Style.entry} key={friendRequest.to.address}>
                    <span>
                        {friendRequest.to.username} {friendRequest.date}
                    </span>{" "}
                    <Button color="secondary" size="sm" onClick={() => onCancelFriendRequest(friendRequest.to.address)}>
                        Cancel
                    </Button>
                </li>
            ))}
        </ul>
        <h5>Received friend requests ({receivedFriendRequests.length})</h5>
        <ul className={Style.list}>
            {receivedFriendRequests.map(friendRequest => (
                <li className={Style.entry} key={friendRequest.from.address}>
                    <span>
                        {friendRequest.from.username} {friendRequest.date}
                    </span>{" "}
                    <Button color="primary" size="sm" onClick={() => onAcceptFriendRequest(friendRequest.from.address)}>
                        Accept
                    </Button>{" "}
                    <Button
                        color="secondary"
                        size="sm"
                        onClick={() => onDeclineFriendRequest(friendRequest.from.address)}
                    >
                        Reject
                    </Button>
                </li>
            ))}
        </ul>
    </div>
);

export default FriendRequests;
