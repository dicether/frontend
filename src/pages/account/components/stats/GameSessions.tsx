import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {GameSession} from "../../../../platform/modules/account/types";
import Ether from "../../../../reusable/Ether";
import {Table} from "../../../../reusable/index";

import Style from "./GameSessions.scss";

const GameSessionRow = ({gameId, balance, roundId}: GameSession) => (
    <tr className="text-center">
        <td>
            <Link to={`/gameSession/${gameId}`}>{gameId}</Link>
        </td>
        <td>{roundId}</td>
        <td>
            <Ether gwei={balance} colored showCurrencySymbol />
        </td>
    </tr>
);

export interface Props extends WithTranslation {
    gameSessions: GameSession[];
}

const GameSessions = ({gameSessions, t}: Props) => (
    <div style={{marginTop: "4em"}}>
        <h4 className="text-center">{t("yourGameSessions")}</h4>
        <div className={Style.gameSessionsWrapper}>
            <Table hover noBorders>
                <thead>
                    <tr className="text-center">
                        <th>{t("gameId")}</th>
                        <th>{t("#bets")}</th>
                        <th>{t("profitInEth")}</th>
                    </tr>
                </thead>
                <tbody className={Style.gamseSessionEntries}>
                    {gameSessions.slice().map(gameSession => (
                        <GameSessionRow key={gameSession.gameId} {...gameSession} />
                    ))}
                </tbody>
            </Table>
        </div>
    </div>
);

export default withTranslation()(GameSessions);
