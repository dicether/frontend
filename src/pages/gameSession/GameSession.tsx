import * as React from "react";

import {Bet} from "../../platform/modules/bets/types";
import {RouteComponentProps} from "react-router";
import BetsList from "../../platform/components/bet/BetsList";
import User from "../../platform/components/user/User";
import {User as UserType} from '../../platform/modules/account/types';
import Ether from "../../reusable/Ether";
import {Container, DataLoader} from "../../reusable";

const Style = require('./GameSession.scss');

type MatchParams = {
    gameId: number
}

interface Props extends RouteComponentProps<MatchParams> {

}

type GameState = {
    status: string,
    user: UserType
    balance: number,
    roundId: number

}

class GameSession extends React.Component<Props> {
    constructor(props: Props){
        super(props);
    }

    render() {
        const gameId = this.props.match.params.gameId;

        return (
            <Container>
                <DataLoader<GameState>
                    url={`/stateChannel/gameState/${gameId}`}
                    success={gameState => (
                        <div className={Style.header}>
                            <h3>Game session:{this.props.match.params.gameId}</h3>
                            <span> Created by <User user={gameState.user}/></span>
                            <span>{gameState.status === "ENDED" ? gameState.roundId - 1 : gameState.roundId} Bets</span>
                            <Ether colored gwei={gameState.balance}/>
                        </div>
                    )}
                />
                <DataLoader<{bets: Bet[]}>
                    url={`/bets/gameId/${gameId}`}
                    success={data => <BetsList bets={data.bets} showUser={false}/>}
                />
            </Container>
        )
    }
}

export default GameSession;
