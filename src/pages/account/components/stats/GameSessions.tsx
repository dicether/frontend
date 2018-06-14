import * as React from "react";
import {Table} from "../../../../reusable/index";
import {GameSession} from "../../../../platform/modules/account/types";
import Ether from "../../../../reusable/Ether";
import {Link} from "react-router-dom";

const Style = require("./GameSessions.scss");

const GameSessionRow = ({gameId, balance, roundId}: GameSession) => (
        <tr className="text-center">
            <td><Link to={`/gameSession/${gameId}`}>{gameId}</Link></td>
            <td>{roundId}</td>
            <td><Ether gwei={balance} colored showCurrencySymbol/></td>
        </tr>
);

export type Props = {
    gameSessions: GameSession[]
}

const GameSessions = ({gameSessions}: Props) => (
    <div style={{marginTop: "4em"}}>
        <h4 className="text-center">Your Game Sessions</h4>
        <div className={Style.gameSessionsWrapper}>
            <Table hover noBorders>
                <thead>
                <tr className="text-center">
                    <th>Game Id</th>
                    <th>#Bets</th>
                    <th>Profit(ETH)</th>
                </tr>
                </thead>
                <tbody className={Style.gamseSessionEntries}>
                {gameSessions.slice().map(gameSession =>
                    <GameSessionRow {...gameSession}/>
                )}
                </tbody>
            </Table>
        </div>
    </div>
);

export default GameSessions;
