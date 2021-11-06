import dayjs from "dayjs";
import * as React from "react";

import {CopyToClipBoard, Ether} from "../../../../reusable/index";
import {User} from "../../../modules/account/types";
import {Bet} from "../../../modules/bets/types";

import Style from "./Overview.scss";

type Props = {
    bet: Bet;
    showUserModal(user: User): void;
};

const Overview = ({bet, showUserModal}: Props) => (
    <div className={Style.overview}>
        <h3>
            Bet:
            {bet.id} <CopyToClipBoard message={"Copied! Paste in Chat!"} content={`Bet:${bet.id}`} />
        </h3>
        <span>{dayjs(bet.timestamp).format("lll")}</span>
        <span>
            Placed by{" "}
            <button className={Style.userName} onClick={() => showUserModal(bet.user)}>
                {bet.user.username}
            </button>
        </span>
        <div className={Style.stats}>
            <div className={Style.statEntry}>
                <span className={Style.entryHeader}>Wagered</span>
                <Ether gwei={bet.value} />
            </div>
            <div className={Style.statEntry}>
                <span className={Style.entryHeader}>Profit</span>
                <Ether colored gwei={bet.profit} />
            </div>
        </div>
    </div>
);

export default Overview;
