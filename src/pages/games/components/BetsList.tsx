import * as React from 'react';
import moment from 'moment';

import {Button, Ether, Modal, Table} from '../../../reusable';
import {Bet} from '../../../platform/modules/bets/types';
import BetInfo from './BetInfo/index';
import User from "../../../platform/components/user/User";

const Style = require('./BetList.scss');


type BetInfoModalProps = {
    bet: Bet,
}

class BetInfoModal extends React.Component<BetInfoModalProps, {isOpen: boolean}> {
    constructor(props: BetInfoModalProps) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    };

    render() {
        const {bet} = this.props;
        const {isOpen} = this.state;

        return ([
                <Button key="1" color="link" onClick={this.toggle}>Show</Button>,
                <Modal key="2" isOpen={isOpen} toggle={this.toggle}>
                    <div style={{margin: '1em 1em 0 1em'}}>
                        <button type="button" className="close" aria-label="Close" onClick={this.toggle}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <BetInfo bet={bet}/>
                </Modal>
        ])

    }
}

type LastBetRowProps = {
    bet: Bet,
    showUser: boolean,
}

const LastBetRow = ({bet, showUser}: LastBetRowProps) => {
    const {timestamp, user, value, profit} = bet;

    return (
        <tr>
            {showUser &&
            <td className={Style.center}><User user={user}/></td>
            }
            <td className={Style.center}>{moment(timestamp).format('LT')}</td>
            <td className={Style.center}><Ether gwei={value} showCurrencySymbol={false}/></td>
            <td className={Style.center}><BetInfoModal bet={bet}/></td>
            <td className={Style.center}><Ether gwei={profit} showCurrencySymbol={false} colored/></td>
        </tr>
    );
};


type Props = {
    bets: Array<Bet>,
    showUser?: boolean
}


const BetsList = ({bets, showUser = true}: Props) => {
    return (
        <Table hover striped responsive>
            <thead>
            <tr className="text-center">
                {showUser &&
                <th className={Style.center}>User</th>
                }
                <th className={Style.center}>Time</th>
                <th className={Style.center}>Bet (ETH)</th>
                <th className={Style.center}>Info</th>
                <th className={Style.center}>Profit (ETH)</th>
            </tr>
            </thead>
            <tbody>
                {bets.slice().map(bet =>
                    <LastBetRow key={bet.id} bet={bet} showUser={showUser}/>
                )}
            </tbody>
        </Table>
    );
};

export default BetsList;
