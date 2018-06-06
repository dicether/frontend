import * as React from 'react';

import {Button, Ether, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ValueInput} from '../../../../reusable';
import {State as Web3State} from '../../../../platform/modules/web3/reducer';
import {generateSeed} from '../../../../util/crypto';
import {SESSION_TIMEOUT} from "../../../../config/config";

type Props = {
    isOpen: boolean,
    minValue: number,
    maxValue: number,
    web3State: Web3State,

    onCreateGame(value: number, seed: string): void,
    onClose(): void,
};

type State = {
    value: number;
    seed: string;
}

function roundValue(value: number, step: number): number {
    return Math.floor(value / step) * step;
}

export default class CreateGameModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const val = props.web3State.balance !== null ? Math.min(props.maxValue, props.web3State.balance) : props.maxValue;

        this.state = {
            value: roundValue(val, props.minValue),
            seed: generateSeed()
        };
    }

    componentWillReceiveProps(newProps: Props) {
        const curBalance = this.props.web3State.balance;
        const newBalance = newProps.web3State.balance;

        if (curBalance !== newBalance && newBalance !== null) {
            const val = Math.min(newProps.maxValue, newBalance);
            this.setState({value: roundValue(val, newProps.minValue)});
        }
    }

    createGame = () => {
        const {onCreateGame, onClose} = this.props;
        const {value, seed} = this.state;

        onCreateGame(value, seed);
        onClose();
    };

    onValueChange = (value: number) => {
        this.setState({value});
    };

    render() {
        const {minValue, maxValue, isOpen, onClose, web3State} = this.props;
        const {value, seed} = this.state;

        const accountBalance = web3State.balance;

        let toLowBalance = false;
        let max = maxValue;
        if (accountBalance !== null) {
            toLowBalance = accountBalance < minValue;
            max = roundValue(Math.min(maxValue, accountBalance), minValue);
        }

        return (
            <Modal isOpen={isOpen} toggle={onClose} title="Create Game Session">
                <ModalBody>
                    {accountBalance === null ?
                        <span className={"text-warning"}>Failed reading your account balance!</span>
                        :
                        <span>Your Balance: <Ether gwei={accountBalance}/></span>
                    }
                    {toLowBalance ?
                        <div>
                            <span className={'text-danger'}>Too low balance on your account!</span>
                        </div>
                        :
                        <div style={{marginTop: '1em'}}>
                            <FormGroup>
                                <Label for="value">Amount to deposit (between <Ether gwei={minValue}/> and <Ether gwei={max}/>)</Label>
                                <ValueInput
                                    id="value"
                                    min={minValue}
                                    max={max}
                                    step={minValue}
                                    value={value}
                                    onChange={this.onValueChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="seed">Your seed used to generate the hash chain</Label>
                                <Input disabled value={seed}/>
                            </FormGroup>
                            <span className={'text-warning'}>
                                The data required for the game session is stored local on your browser. So don't clear
                                your browser history as long as the game session is active.
                                If your are done with playing you must end the game session. If you don't end the game session,
                                we will end it after waiting {SESSION_TIMEOUT} hours and you will need to pay a fine!
                            </span>
                        </div>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" disabled={toLowBalance} onClick={this.createGame}>Deposit</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
