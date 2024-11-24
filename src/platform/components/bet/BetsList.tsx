import dayjs from "dayjs";
import * as React from "react";
import {Link} from "react-router-dom";

import {Ether, Table} from "../../../reusable/index";
import {User} from "../../modules/account/types";
import {Bet} from "../../modules/bets/types";
import {gameTypeToLink, gameTypeToName} from "./util";

import * as Style from "./BetList.scss";

type LastBetRowProps = {
    bet: Bet;
    showUser: boolean;
    showBetModal(bet: Bet): void;
    showUserModal(user: User): void;
};

const LastBetRow = ({bet, showUser, showBetModal, showUserModal}: LastBetRowProps) => {
    const {timestamp, user, value, profit} = bet;
    const {gameType} = bet;

    return (
        <tr>
            <td className={Style.tdGameType}>
                <div className={Style.gameType}>
                    <Link className={Style.gameLink} to={gameTypeToLink(gameType)}>
                        {gameTypeToName(gameType)}
                    </Link>
                    <button className={Style.infoButton} key="1" color="link" onClick={() => showBetModal(bet)}>
                        Info
                    </button>
                </div>
            </td>
            {showUser && (
                <td className={Style.center}>
                    <div>
                        <button className={Style.userButton} onClick={() => showUserModal(user)}>
                            {user.username}
                        </button>
                    </div>
                </td>
            )}
            <td className={Style.center + " d-none d-sm-table-cell"}>
                <div>{dayjs(timestamp).format("LT")}</div>
            </td>
            <td className={Style.center + " d-none d-sm-table-cell"}>
                <div>
                    <Ether gwei={value} showCurrencySymbol />
                </div>
            </td>
            <td className={Style.profit}>
                <div>
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
                <tr>
                    <th>Game</th>
                    {showUser && <th className={Style.center}>User</th>}
                    <th className={Style.center + " d-none d-sm-table-cell"}>Time</th>
                    <th className={Style.center + " d-none d-sm-table-cell"}>Bet</th>
                    <th className={Style.profitHeader}>Profit</th>
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
