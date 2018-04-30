import * as React from 'react';
import {Bet} from '../../../../platform/modules/bets/types';

import { calcResultNumber, verifyBetSignature, verifySeed} from '../../../../stateChannel';
import {FontAwesomeIcon} from "../../../../reusable";
import {SERVER_ADDRESS} from "../../../../config/config";

const Style = require('./Verification.scss');


type Props = {
    bet: Bet
}


const Valid = ({valid}: {valid: boolean}) => (
    valid ?
        <FontAwesomeIcon icon="check" color="success"/>
        :
        <FontAwesomeIcon icon="times" color="danger"/>
);


class Verification extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {bet} = this.props;

        const validUserSeed = verifySeed(bet.userSeed, bet.userHash);
        const validServerSeed = verifySeed(bet.serverSeed, bet.serverHash);
        const validUserSig = verifyBetSignature(bet.roundId, bet.gameType, bet.num, bet.value, bet.balance,
            bet.serverHash, bet.userHash, bet.gameId, bet.contractAddress, bet.userSig, bet.user.address);
        const validServerSig = verifyBetSignature(bet.roundId, bet.gameType, bet.num, bet.value, bet.balance,
            bet.serverHash, bet.userHash, bet.gameId, bet.contractAddress, bet.serverSig, SERVER_ADDRESS);

        const resultNum = calcResultNumber(bet.gameType, bet.serverSeed, bet.userSeed);

        const validResultNum = bet.resultNum === resultNum;

        return (
            <div className={Style.verification}>
                <div className={Style.entry}>
                    <code>keccak(userSeed) == userHash</code>
                    <Valid valid={validUserSeed}/>
                </div>
                <div className={Style.entry}>
                    <code>keccak(serverSeed) == serverHash</code>
                    <Valid valid={validServerSeed}/>

                </div>
                <div className={Style.entry}>
                    <code>userSignature is valid</code>
                    <Valid valid={validUserSig}/>
                </div>
                <div className={Style.entry}>
                    <code>serverSignature is valid</code>
                    <Valid valid={validServerSig}/>
                </div>
                <div className={Style.entry}>
                    <code>ResultNum is valid</code>
                    <Valid valid={validResultNum}/>
                </div>
            </div>
        )
    }
}

export default Verification;
