import * as React from "react";
import axios from "axios";

import BetInfo from "./BetInfo";
import {Bet} from "../../modules/bets/types";

type Props = {
    betId: number
};

type State = {
    bet?: Bet
}


class BetLoader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            bet: undefined
        }
    }

    componentDidMount() {
        this.fetchData(this.props.betId);
    }

    fetchData = (betId: number) => {
        axios.get(`/bet/${betId}`).then(response => {
            const bet = response.data;
            this.setState({bet});
        }).catch(console.log);
    };

    render() {
        const {bet} = this.state;

        return (
            bet ? <BetInfo bet={bet}/> : null
        );

    }
}

export default BetLoader;
