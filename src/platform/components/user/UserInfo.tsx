import * as React from "react";

import GameStats from "../../../pages/account/components/stats/GameStats";
import {Address, CopyToClipBoard, DataLoader} from "../../../reusable";
import {Stats as StatsType, User} from "../../modules/account/types";

import * as Style from "./UserInfo.scss";

type Props = {
    user: User;
};

export default class UserInfo extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {user} = this.props;

        return (
            <div className={Style.userInfo}>
                <h3 className="text-center">
                    {user.username}
                    <CopyToClipBoard message={"Copied! Paste in Chat!"} content={`User:${user.username}`} />
                </h3>
                <Address address={user.address} />
                <DataLoader<StatsType>
                    url={`/stats/user/${user.address}`}
                    success={(stats) => <GameStats stats={stats} />}
                />
            </div>
        );
    }
}
