import * as React from 'react';

import {Button, Modal, ModalBody} from "../../../reusable";
import BetLoader from "./BetLoader";

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
                <BetLoader betId={betId}/>
            </Modal>
        ])
    }
}

export default Bet;
