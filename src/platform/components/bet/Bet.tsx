import * as React from 'react';

import {DataLoader, Modal} from "../../../reusable";
import BetInfo from "./BetInfo";
import {Bet as BetType} from "../../modules/bets/types";

const Style = require('./Bet.scss');

export type Props = {
    betId: number,
    betButton?: React.ReactNode
}

export type State = {
    showModal;
}


class  Bet extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    onToggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    };

    render() {
        const {betId, betButton} = this.props;

        return ([
            <button key={1} className={Style.bet} onClick={this.onToggleModal}>
                { betButton ? betButton : `Bet:${betId}` }
            </button>,
            <Modal key={2} isOpen={this.state.showModal} toggle={this.onToggleModal}>
                <DataLoader<BetType> url={`/bet/${betId}`} success={(bet) => <BetInfo bet={bet}/>}/>
            </Modal>
        ])
    }
}

export default Bet;
