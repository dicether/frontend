import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";

import {Button} from "../../../reusable/index";
import {FriendRequest} from "../../modules/friends/types";

import * as Style from "./FriendRequests.scss";

export interface Props extends WithTranslation {
    receivedFriendRequests: FriendRequest[];
    sentFriendRequests: FriendRequest[];

    onAcceptFriendRequest(address: string): void;
    onDeclineFriendRequest(address: string): void;
    onCancelFriendRequest(address: string): void;
}

const FriendRequests = ({
    receivedFriendRequests,
    sentFriendRequests,
    onAcceptFriendRequest,
    onDeclineFriendRequest,
    onCancelFriendRequest,
    t,
}: Props) => (
    <div>
        <h5>
            {t("sentFriendRequests")} ({sentFriendRequests.length})
        </h5>
        <ul className={Style.list}>
            {sentFriendRequests.map((friendRequest) => (
                <li className={Style.entry} key={friendRequest.to.address}>
                    <span>{`${friendRequest.to.username} ${friendRequest.date}`}</span>{" "}
                    <Button color="secondary" size="sm" onClick={() => onCancelFriendRequest(friendRequest.to.address)}>
                        {t("cancel")}
                    </Button>
                </li>
            ))}
        </ul>
        <h5>
            {t("receivedFriendRequests")} ({receivedFriendRequests.length})
        </h5>
        <ul className={Style.list}>
            {receivedFriendRequests.map((friendRequest) => (
                <li className={Style.entry} key={friendRequest.from.address}>
                    <span>{`${friendRequest.to.username} ${friendRequest.date}`}</span>{" "}
                    <Button color="primary" size="sm" onClick={() => onAcceptFriendRequest(friendRequest.from.address)}>
                        Accept
                    </Button>{" "}
                    <Button
                        color="secondary"
                        size="sm"
                        onClick={() => onDeclineFriendRequest(friendRequest.from.address)}
                    >
                        {t("reject")}
                    </Button>
                </li>
            ))}
        </ul>
    </div>
);

export default withTranslation()(FriendRequests);
