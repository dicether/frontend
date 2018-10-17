import * as React from "react";

import {SESSION_TIMEOUT} from "../../../../config/config";
import {State as Web3State} from "../../../../platform/modules/web3/reducer";
import {Button, Ether, Form, FormGroup, Input, Label, Modal, ValueInput} from "../../../../reusable";
import {generateSeed} from "../../../../util/crypto";

type Props = {
    isOpen: boolean;
    minValue: number;
    maxValue: number;
    web3State: Web3State;

    onCreateGame(value: number, seed: string): void;
    onClose(): void;
};

type State = {
    value: number;
    seed: string;
};

function roundValue(value: number, step: number): number {
    return Math.floor(value / step) * step;
}

export default class CreateGameModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const balance = props.web3State.balance;
        const val = balance !== null ? Math.min(props.maxValue, balance) : props.maxValue;

        this.state = {
            value: roundValue(val, props.minValue),
            seed: generateSeed(),
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

    private createGame = (e: React.FormEvent<HTMLFormElement>) => {
        const {onCreateGame, onClose} = this.props;
        const {value, seed} = this.state;

        onCreateGame(value, seed);
        onClose();
        e.preventDefault();
    }

    private onValueChange = (value: number) => {
        this.setState({value});
    }

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
            <Modal isOpen={isOpen} toggle={onClose}>
                <h3 className="text-center">Create Game Session</h3>
                {accountBalance === null ? (
                    <p className={"text-warning"}>Failed reading your account balance!</p>
                ) : (
                    <p>
                        Your Balance: <Ether gwei={accountBalance} /> ETH
                    </p>
                )}
                {toLowBalance ? (
                    <p className={"text-danger"}>Too low balance on your account!</p>
                ) : (
                    <Form onSubmit={this.createGame}>
                        <FormGroup>
                            <Label for="value">
                                Amount to deposit (between <Ether gwei={minValue} precision={2} />
                                and <Ether gwei={max} precision={2} /> ETH)
                            </Label>
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
                            <Input disabled value={seed} />
                        </FormGroup>
                        <FormGroup className="text-warning">
                            The data required for the game session is stored local on your browser. So{" "}
                            <em>don't clear your browser history</em> as long as the game session is active. If your are
                            done with playing you must end the game session. If you don't end the game session, we will
                            end it after waiting {SESSION_TIMEOUT} hours and you will need to pay a fine!
                        </FormGroup>
                        <FormGroup>
                            <Button type="submit" color="primary" disabled={toLowBalance}>
                                Deposit
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Modal>
        );
    }
}
