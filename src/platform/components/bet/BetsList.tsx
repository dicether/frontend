import moment from "moment";
import * as React from "react";

import {Button, Ether, Modal, Table} from "../../../reusable/index";
import {User} from "../../modules/account/types";
import {Bet} from "../../modules/bets/types";

const Style = require("./BetList.scss");

type LastBetRowProps = {
    bet: Bet;
    showUser: boolean;
    showBetModal(bet: Bet): void;
    showUserModal(user: User): void;
};

const LastBetRow = ({bet, showUser, showBetModal, showUserModal}: LastBetRowProps) => {
    const {timestamp, user, value, profit} = bet;

    return (
        <tr>
            {showUser && (
                <td className={Style.center}>
                    <div className={Style.entry}>
                        <button className={Style.userButton} onClick={() => showUserModal(user)}>
                            {user.username}
                        </button>
                    </div>
                </td>
            )}
            <td className={Style.center}>
                <div className={Style.entry}>{moment(timestamp).format("LT")}</div>
            </td>
            <td className={Style.center}>
                <div className={Style.entry}>
                    <Ether gwei={value} showCurrencySymbol />
                </div>
            </td>
            <td className={Style.center}>
                <div className={Style.entry}>
                    <Button className={Style.infoButton} key="1" color="link" onClick={() => showBetModal(bet)}>
                        Show
                    </Button>
                </div>
            </td>
            <td className={Style.center}>
                <div className={Style.entry}>
                    <Ether gwei={profit} showCurrencySymbol colored />
                </div>
            </td>
        </tr>
    );
};

type Props = {
    bets: Bet[];
    showUser?: boolean;
    showBetModal(bet: Bet): void;
    showUserModal(user: User): void;
};

const BetsList = ({bets, showUser = true, showBetModal, showUserModal}: Props) => {
    return (
        <Table className={Style.table} hover noBorders responsive>
            <thead className={Style.head}>
                <tr className="text-center">
                    {showUser && <th className={Style.center}>User</th>}
                    <th className={Style.center}>Time</th>
                    <th className={Style.center}>Bet</th>
                    <th className={Style.center}>Info</th>
                    <th className={Style.center}>Profit</th>
                </tr>
            </thead>
            <tbody className={Style.entries}>
                {bets.slice().map(bet => (
                    <LastBetRow
                        key={bet.id}
                        bet={bet}
                        showUser={showUser}
                        showBetModal={showBetModal}
                        showUserModal={showUserModal}
                    />
                ))}
            </tbody>
        </Table>
    );
};

export default BetsList;
