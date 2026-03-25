import dayjs from "dayjs";
import * as React from "react";
import {Link} from "react-router-dom";

import {gameTypeToLink, gameTypeToName} from "./util";
import {Ether, Table} from "../../../reusable/index";
import {User} from "../../modules/account/types";
import {Bet} from "../../modules/bets/types";

import * as Style from "./BetList.scss";

interface LastBetRowProps {
    bet: Bet;
    showUser: boolean;
    showBetModal: (bet: Bet) => void;
    showUserModal: (user: User) => void;
}

const LastBetRow = ({bet, showUser, showBetModal, showUserModal}: LastBetRowProps) => {
    const {timestamp, user, value, profit} = bet;
    const {gameType} = bet;

    return (
        <tr>
            <td>
                <Link className={Style.gameLink} to={gameTypeToLink(gameType)}>
                    {gameTypeToName(gameType)}
                </Link>
            </td>
            <td>
                <button className={Style.betId} onClick={() => showBetModal(bet)}>
                    {bet.id}
                </button>
            </td>
            {showUser && (
                <td>
                    <div>
                        <button className={Style.userButton} onClick={() => showUserModal(user)}>
                            {user.username}
                        </button>
                    </div>
                </td>
            )}
            <td className={"d-none d-sm-table-cell"}>
                <div>{dayjs(timestamp).format("LT")}</div>
            </td>
            <td className={"d-none d-sm-table-cell"}>
                <div>
                    <Ether gwei={value} showCurrencySymbol />
                </div>
            </td>
            <td>
                <div>
                    <Ether gwei={profit} showCurrencySymbol colored />
                </div>
            </td>
        </tr>
    );
};

interface Props {
    bets: Bet[];
    showUser?: boolean;
    showBetModal: (bet: Bet) => void;
    showUserModal: (user: User) => void;
}

const BetsList = ({bets, showUser = true, showBetModal, showUserModal}: Props) => {
    return (
        <Table className={Style.table} hover noBorders responsive>
            <thead className={Style.head}>
                <tr>
                    <th>Game</th>
                    <th className={Style.center}>Bet ID</th>
                    {showUser && <th>User</th>}
                    <th className={"d-none d-sm-table-cell"}>Time</th>
                    <th className={"d-none d-sm-table-cell"}>Bet</th>
                    <th>Profit</th>
                </tr>
            </thead>
            <tbody className={Style.entries}>
                {bets.slice().map((bet) => (
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
