import * as React from "react";
import {connect} from "react-redux";

import {RouteComponentProps} from "react-router";
import {bindActionCreators} from "redux";
import BetsList from "../../platform/components/bet/BetsList";
import User from "../../platform/components/user/User";
import {User as UserType} from "../../platform/modules/account/types";
import {Bet} from "../../platform/modules/bets/types";
import {showBetModal} from "../../platform/modules/modals/actions";
import {Container, DataLoader} from "../../reusable";
import Ether from "../../reusable/Ether";
import {Dispatch} from "../../util/util";

const Style = require("./GameSession.scss");

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            showBetModal,
        },
        dispatch
    );

type MatchParams = {
    gameId: number;
};

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<MatchParams>;

type GameState = {
    status: string;
    user: UserType;
    balance: number;
    roundId: number;
};

class GameSession extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {showBetModal} = this.props;
        const gameId = this.props.match.params.gameId;

        return (
            <Container>
                <DataLoader<GameState>
                    url={`/stateChannel/gameState/${gameId}`}
                    success={gameState => (
                        <div className={Style.header}>
                            <h3>
                                Game session:
                                {this.props.match.params.gameId}
                            </h3>
                            <span>
                                {" "}
                                Created by <User user={gameState.user} />
                            </span>
                            <span>{gameState.status === "ENDED" ? gameState.roundId - 1 : gameState.roundId} Bets</span>
                            <Ether colored gwei={gameState.balance} />
                        </div>
                    )}
                />
                <DataLoader<{bets: Bet[]}>
                    url={`/bets/gameId/${gameId}`}
                    success={data => (
                        <BetsList bets={data.bets} showUser={false} showBetModal={bet => showBetModal({bet})} />
                    )}
                />
            </Container>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(GameSession);
