import * as React from 'react';

import {Bet} from '../../../../platform/modules/bets/types';
import {Collapse, Output} from '../../../../reusable/index';
import CollapseButton from './CollapseButton';
import {FROM_BASE_TO_WEI} from '../../../../config/config';
import Verification from './Verification';

const Style = require('./VerificationInfo.scss');


type Props = {
    bet: Bet
}

type State = {
    isOpen: boolean
}

const Entry = ({id, name, data}: { id: string, name: string, data: string | number }) => (
    <div className={Style.verificationInfo__entry}>
        <span>{name}</span>
        <Output className={Style.verificationInfo__value} id={id} value={data}/>
    </div>
);


class VerificationInfo extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    };

    render() {
        const {isOpen} = this.state;
        const {bet} = this.props;

        return (
            <div className={Style.verificationInfo}>
                <CollapseButton name="Show Verification Data" isOpen={isOpen} onClick={this.toggle}/>
                <Collapse isOpen={isOpen} style={{width: '100%'}}>
                    <div>
                        <Entry id={`bet_${bet.id}_roundId`} name="Round Id" data={bet.roundId}/>
                        <Entry id={`bet_${bet.id}_gameType`} name="Game Type" data={bet.gameType}/>
                        <Entry id={`bet_${bet.id}_num`} name="Number" data={bet.num}/>
                        <Entry id={`bet_${bet.id}_betValue`} name="Bet Value (Wei)" data={bet.value * FROM_BASE_TO_WEI}/>
                        <Entry id={`bet_${bet.id}_balance`} name="Balance (Wei)" data={bet.balance * FROM_BASE_TO_WEI}/>
                        <Entry id={`bet_${bet.id}_serverHash`} name="Server Hash" data={bet.serverHash}/>
                        <Entry id={`bet_${bet.id}_userHash`} name="User Hash" data={bet.userHash}/>
                        <Entry id={`bet_${bet.id}_serverSeed`} name="Server seed" data={bet.serverSeed}/>
                        <Entry id={`bet_${bet.id}_userSeed`} name="User seed" data={bet.userSeed}/>
                        <Entry id={`bet_${bet.id}_gameId`} name="Game Id" data={bet.gameId}/>
                        <Entry id={`bet_${bet.id}_contractAddress`} name="Contract Address" data={bet.contractAddress}/>
                        <Entry id={`bet_${bet.id}_serverSig`} name="Server Signature" data={bet.serverSig}/>
                        <Entry id={`bet_${bet.id}_userSig`} name="User Signature" data={bet.userSig}/>
                    </div>
                    <Verification bet={bet}/>
                </Collapse>
            </div>
        )
    }
}

export default VerificationInfo;
