import * as React from "react";
import axios from "axios";

import {Bet} from "../../platform/modules/bets/types";
import {RouteComponentProps} from "react-router";
import BetsList from "../games/components/BetsList";
import User from "../../platform/components/user/User";
import {User as UserType} from '../../platform/modules/account/types';
import Ether from "../../reusable/Ether";
import {Container} from "../../reusable";

const Style = require('./GameSession.scss');

type MatchParams = {
    gameId: number
}

interface Props extends RouteComponentProps<MatchParams> {

}

type GameState = {
    user: UserType
    balance: number,

}

type State = {
    bets: Bet[],
    gameState?: GameState
}

class GameSession extends React.Component<Props, State> {
    constructor(props: Props){
        super(props);

        this.state = {
            bets: [],
            gameState: undefined
        }
    }

    componentWillMount() {
        const gameId = this.props.match.params.gameId;
        this.fetchData(gameId);
    }

    fetchData = (gameId: number) => {
        axios.get(`/gameState/${gameId}`).then(response => {
            const gameState = response.data;
            this.setState({gameState});
        }).catch(console.log);

        axios.get(`/bets/${gameId}`).then(response => {
            const bets = response.data.bets;
            this.setState({bets});
        }).catch(console.log);
    };


    render() {
        const {bets, gameState} = this.state;
        const numBets = bets.length;

        if (!gameState) {
            return null;
        }

        return (
            <Container>
                <div className={Style.header}>
                    <h3>Game session:{this.props.match.params.gameId}</h3>
                    <span> Created by <User user={gameState.user}/></span>
                    <span>{numBets} Bets</span>
                    <Ether colored gwei={gameState.balance}/>
                </div>
                <BetsList bets={bets} showUser={false}/>
            </Container>
        )
    }
}

export default GameSession;
