import * as React from "react";
import {Table} from "../../../../reusable/index";
import {GameSession} from "../../../../platform/modules/account/types";
import Ether from "../../../../reusable/Ether";
import {Link} from "react-router-dom";

const GameSessionRow = ({gameId, balance, roundId}: GameSession) => (
        <tr className="text-center">
            <td><Link to={`/gameSession/${gameId}`}>{gameId}</Link></td>
            <td><Ether gwei={balance} colored showCurrencySymbol={false}/></td>
            <td>{roundId}</td>
        </tr>
);

export type Props = {
    gameSessions: GameSession[]
}

const GameSessions = ({gameSessions}: Props) => (
    <div style={{marginTop: "3em"}}>
        <h4 className="text-center">Your Game Sessions</h4>
        <Table hover striped responsive>
            <thead>
            <tr className="text-center">
                <th>Game Id</th>
                <th>Profit(ETH)</th>
                <th>#Bets</th>
            </tr>
            </thead>
            <tbody>
            {gameSessions.slice().map(gameSession =>
                <GameSessionRow {...gameSession}/>
            )}
            </tbody>
        </Table>
    </div>
);

export default GameSessions;
