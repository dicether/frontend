import {calcResultNumber, verifySeed, verifySignature} from "@dicether/state-channel";
import * as React from "react";

import {CHAIN_ID, SERVER_ADDRESS} from "../../../../config/config";
import {FontAwesomeIcon} from "../../../../reusable/index";
import {Bet} from "../../../modules/bets/types";

import * as Style from "./Verification.scss";

interface Props {
    bet: Bet;
}

const OLD_SERVER_ADDRESS = "0xCef260a5Fed7A896BBE07b933B3A5c17aEC094D8";

const Valid = ({valid}: {valid: boolean}) =>
    valid ? <FontAwesomeIcon icon="check" color="success" /> : <FontAwesomeIcon icon="times" color="danger" />;

class Verification extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {bet} = this.props;

        const validUserSeed = verifySeed(bet.userSeed, bet.userHash);
        const validServerSeed = verifySeed(bet.serverSeed, bet.serverHash);

        const signatureVersion = 2;
        const serverAddress = bet.gameId < 5246 ? OLD_SERVER_ADDRESS : SERVER_ADDRESS;

        const validUserSig = verifySignature(
            bet,
            CHAIN_ID,
            bet.contractAddress,
            bet.userSig,
            bet.user.address,
            signatureVersion,
        );
        const validServerSig = verifySignature(
            bet,
            CHAIN_ID,
            bet.contractAddress,
            bet.serverSig,
            serverAddress,
            signatureVersion,
        );

        const resultNum = calcResultNumber(bet.gameType, bet.serverSeed, bet.userSeed, bet.num);

        const validResultNum = bet.resultNum === resultNum;

        return (
            <div className={Style.verification}>
                <div className={Style.entry}>
                    <code>keccak(userSeed) == userHash</code>
                    <Valid valid={validUserSeed} />
                </div>
                <div className={Style.entry}>
                    <code>keccak(serverSeed) == serverHash</code>
                    <Valid valid={validServerSeed} />
                </div>
                <div className={Style.entry}>
                    <code>userSignature is valid</code>
                    <Valid valid={validUserSig} />
                </div>
                <div className={Style.entry}>
                    <code>serverSignature is valid</code>
                    <Valid valid={validServerSig} />
                </div>
                <div className={Style.entry}>
                    <code>ResultNum is valid</code>
                    <Valid valid={validResultNum} />
                </div>
            </div>
        );
    }
}

export default Verification;
