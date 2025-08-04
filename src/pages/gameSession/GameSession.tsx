import * as React from "react";
import {connect} from "react-redux";
import {useParams} from "react-router-dom";
import {bindActionCreators} from "redux";

import PathNotFound from "../../app/PathNotFound";
import BetsList from "../../platform/components/bet/BetsList";
import {User as UserType} from "../../platform/modules/account/types";
import {Bet} from "../../platform/modules/bets/types";
import {showBetModal, showUserModal} from "../../platform/modules/modals/slice";
import {Container, DataLoader} from "../../reusable";
import Ether from "../../reusable/Ether";
import {Dispatch} from "../../util/util";

import * as Style from "./GameSession.scss";

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            showBetModal,
            showUserModal,
        },
        dispatch,
    );

interface MatchParams {
    gameId: string;
}

type Props = ReturnType<typeof mapDispatchToProps>;

interface GameState {
    status: string;
    user: UserType;
    balance: number;
    roundId: number;
}

const GameSession = (props: Props) => {
    const {showBetModal, showUserModal} = props;
    const params = useParams<MatchParams>();

    const gameIdString = params.gameId;
    if (!gameIdString) {
        return <PathNotFound />;
    }

    const gameId = /\d+/.exec(gameIdString);
    if (!gameId) {
        return <PathNotFound />;
    }

    return (
        <Container>
            <DataLoader<GameState>
                url={`/stateChannel/gameState/${gameId}`}
                success={(gameState) => (
                    <div className={Style.header}>
                        <h3>
                            Game session:
                            {gameId}
                        </h3>
                        <span>
                            Created by{" "}
                            <button className={Style.userButton} onClick={() => showUserModal({user: gameState.user})}>
                                {gameState.user.username}
                            </button>
                        </span>
                        <span>{gameState.status === "ENDED" ? gameState.roundId - 1 : gameState.roundId} Bets</span>
                        <Ether colored gwei={gameState.balance} />
                    </div>
                )}
            />
            <DataLoader<{bets: Bet[]}>
                url={`/bets/gameId/${gameId}`}
                success={(data) => (
                    <BetsList
                        bets={data.bets}
                        showUser={false}
                        showBetModal={(bet) => showBetModal({bet})}
                        showUserModal={(user) => showUserModal({user})}
                    />
                )}
            />
        </Container>
    );
};

export default connect(null, mapDispatchToProps)(GameSession);
