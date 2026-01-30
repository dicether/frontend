import * as React from "react";
import {useBalance, useConnection} from "wagmi";

import {GAME_SESSION_TIMEOUT} from "../../../../config/config";
import {Button, Ether, Form, FormGroup, Input, Label, Modal, ValueInput} from "../../../../reusable";

interface Props {
    seed: string;
    isOpen: boolean;
    minValue: number;
    maxValue: number;

    onCreateGame: (value: number, seed: string) => void;
    onClose: () => void;
}

function roundValue(value: number, step: number): number {
    return Math.floor(value / step) * step;
}

const CreateGameModal = ({seed, isOpen, minValue, maxValue, onCreateGame, onClose}: Props) => {
    const [value, setValue] = React.useState(roundValue(maxValue, minValue));

    const createGame = (e: React.FormEvent<HTMLFormElement>) => {
        onCreateGame(value, seed);
        onClose();
        e.preventDefault();
    };

    const onValueChange = (value: number) => {
        setValue(value);
    };

    const {address} = useConnection();
    const result = useBalance({address});
    const accountBalance = result.data?.value !== undefined ? Number(result.data.value) : null;

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
                <p className={"text-danger"}>
                    Too low balance on your account! You need at least <Ether gwei={minValue} precision={2} /> ETH
                </p>
            ) : (
                <Form onSubmit={createGame}>
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
                            onChange={onValueChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="seed">Your seed used to generate the hash chain</Label>
                        <Input disabled value={seed} />
                    </FormGroup>
                    <FormGroup className="text-warning">
                        The data required for the game session is stored local on your browser. So{" "}
                        <em>don't clear your browser history</em> as long as the game session is active. If your are
                        done with playing you must end the game session. If you don't end the game session, we will end
                        it after waiting {GAME_SESSION_TIMEOUT} hours and you will need to pay a fine!
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
};

export default CreateGameModal;
