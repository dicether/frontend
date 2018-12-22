import * as React from "react";

import {
    HOUSE_EDGE,
    HOUSE_EDGE_DIVISOR,
    MAX_NUMBER_DICE_1,
    MIN_BET_VALUE,
    MIN_NUMBER_DICE_1,
    RANGE,
} from "../../../../config/config";
import {formatEth} from "../../../../reusable/Ether";
import {Button, Col, FormGroup, Input, Label, Modal, NumericInput, Row, ValueInput} from "../../../../reusable/index";
import DiceSlider from "./DiceSlider";
import HowToPlay from "./HowToPlay";
import ReverseRollButton from "./ReverseRollButton";

const Style = require("./DiceUi.scss");

function calcChance(num: number, reversedRoll: boolean) {
    return reversedRoll ? (RANGE - num - 1) / RANGE : num / RANGE;
}

function calcPayOutMultiplier(num: number, reversedRoll: boolean) {
    const houseEdgeFactor = 1 - HOUSE_EDGE / HOUSE_EDGE_DIVISOR;

    return reversedRoll ? (RANGE / (RANGE - num - 1)) * houseEdgeFactor : (RANGE / num) * houseEdgeFactor;
}

function calcNumberFromPayOutMultiplier(multiplier: number, reversedRoll: boolean) {
    const houseEdgeFactor = 1 - HOUSE_EDGE / HOUSE_EDGE_DIVISOR;
    const n = (RANGE / multiplier) * houseEdgeFactor;
    const num = reversedRoll ? RANGE - 1 - n : n;
    return Math.round(num);
}

type Props = {
    num: number;
    value: number;
    reverseRoll: boolean;
    showResult: boolean;
    sound: boolean;
    showHelp: boolean;
    maxBetValue: number;
    result: {num: number; won: boolean};

    onToggleHelp(): void;
    onNumberChange(num: number): void;
    onValueChange(value: number): void;
    onReverseRoll(): void;
    onPlaceBet(): void;
};

export default class DiceUi extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    setNumber(num: number) {
        const {onNumberChange} = this.props;

        if (num < MIN_NUMBER_DICE_1) {
            num = MIN_NUMBER_DICE_1;
        } else if (num > MAX_NUMBER_DICE_1) {
            num = MAX_NUMBER_DICE_1;
        }

        onNumberChange(num);
    }

    onNumberChange = (num: number) => {
        this.setNumber(num);
    }

    onMultiplierChange = (multiplier: number) => {
        const {reverseRoll} = this.props;
        const num = calcNumberFromPayOutMultiplier(multiplier, reverseRoll);
        this.setNumber(num);
    }

    onChanceChange = (chance: number) => {
        const {reverseRoll} = this.props;

        const num = reverseRoll ? RANGE - 1 - RANGE * chance : RANGE * chance;
        this.setNumber(Math.round(num));
    }

    render() {
        const {
            num,
            value,
            reverseRoll,
            result,
            showResult,
            sound,
            showHelp,
            onValueChange,
            onReverseRoll,
            onToggleHelp,
            onPlaceBet,
            maxBetValue,
        } = this.props;

        const multiplier = calcPayOutMultiplier(num, reverseRoll);
        const profit = multiplier * value;
        const chance = calcChance(num, reverseRoll);
        const maxPayoutMultiplier = calcPayOutMultiplier(MIN_NUMBER_DICE_1, false);
        const minPayoutMultiplier = calcPayOutMultiplier(MAX_NUMBER_DICE_1, false);

        const reverseButton = <ReverseRollButton reversed={reverseRoll} onClick={onReverseRoll} />;

        return (
            <div>
                <div className={Style.ui}>
                    <div className={"form-row"} style={{alignItems: "flex-end"}}>
                        <Col sm={6} xs={12}>
                            <FormGroup className="games__form-group">
                                <Label>Bet Amount (ETH)</Label>
                                <ValueInput
                                    value={value}
                                    min={MIN_BET_VALUE}
                                    step={MIN_BET_VALUE}
                                    max={maxBetValue}
                                    onChange={onValueChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={6} xs={6}>
                            <FormGroup className="games__form-group">
                                <Label>Profit on win (ETH)</Label>
                                {/*<span><Ether value={payOut}/></span>*/}
                                <Input disabled readOnly value={formatEth(profit - value)} />
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={4}>
                            <FormGroup className="games__form-group">
                                <Label>{reverseRoll ? "Bet over" : "Bet under"}</Label>
                                <NumericInput
                                    number={num}
                                    step={1}
                                    min={MIN_NUMBER_DICE_1}
                                    max={MAX_NUMBER_DICE_1}
                                    onNumber={this.onNumberChange}
                                    suffix={reverseButton}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={4} className="hidden-xs-down">
                            <FormGroup className="games__form-group">
                                <Label>Payout</Label>
                                <NumericInput
                                    number={multiplier}
                                    suffix="x"
                                    precision={3}
                                    min={minPayoutMultiplier}
                                    max={maxPayoutMultiplier}
                                    onNumber={this.onMultiplierChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={4} className="hidden-xs-down">
                            <FormGroup className="games__form-group">
                                <Label>Win chance</Label>
                                <NumericInput
                                    number={chance * 100}
                                    suffix="%"
                                    precision={0}
                                    min={MIN_NUMBER_DICE_1}
                                    max={MAX_NUMBER_DICE_1}
                                    step={1}
                                    onNumber={num => this.onChanceChange(num / 100)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                    <Row noGutters>
                        <Button className="betButton" block color="success" onClick={onPlaceBet}>
                            Roll Dice
                        </Button>
                    </Row>
                    <Modal isOpen={showHelp} toggle={onToggleHelp}>
                        <HowToPlay />
                    </Modal>
                </div>
                <DiceSlider
                    num={num}
                    onNumberChange={this.onNumberChange}
                    showResult={showResult}
                    result={result}
                    sound={sound}
                    reversedRoll={reverseRoll}
                />
            </div>
        );
    }
}
