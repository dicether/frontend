import * as React from 'react';

import {Button, Col, FormGroup, Input, Label, Modal, ModalBody, NumericInput, Row, ValueInput} from '../../../reusable';
import {formatEth} from '../../../reusable/Ether';
import DiceSlider from './DiceSlider';
import HowToPlay from './HowToPlay';
import {
    HOUSE_EDGE, HOUSE_EDGE_DIVISOR, MAX_NUMBER_DICE_1, MIN_BET_VALUE, MIN_NUMBER_DICE_1,
    RANGE
} from '../../../config/config';
import ReverseRollButton from "./ReverseRollButton";

const Style = require('./DiceUi.scss');


type Props = {
    showResult: boolean,
    sound: boolean,
    showHelp: boolean,
    stake: number,
    maxBetValue: number,
    result: {num: number, won: boolean},

    onToggleHelp(): void,
    onBet(num: number, value: number, reversedRoll: boolean): void,
}

type State = {
    num: number,
    value: number,
    reversedRoll: boolean
}


function calcChance(num: number, reversedRoll: boolean) {
    return reversedRoll ?  (RANGE - num - 1) / RANGE : num / RANGE;
}

function calcPayOutMultiplier(num: number, reversedRoll: boolean) {
    const houseEdgeFactor = (1 - HOUSE_EDGE / HOUSE_EDGE_DIVISOR);

    return reversedRoll ? RANGE / (RANGE - num - 1) * houseEdgeFactor : RANGE / num * houseEdgeFactor;
}


function calcNumberFromPayOutMultiplier(multiplier: number, reversedRoll: boolean) {
    const houseEdgeFactor = (1 - HOUSE_EDGE / HOUSE_EDGE_DIVISOR);
    const n = RANGE / multiplier * houseEdgeFactor;
    const num =  reversedRoll ? (RANGE - 1 - n) : n;
    return Math.round(num);
}



export default class DiceUi extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            num: 50,
            value: this.props.maxBetValue,
            reversedRoll: false
        };
    }

    componentWillReceiveProps(props: Props) {
        const {maxBetValue: oldMaxBetValue, stake: oldStake} = this.props;
        const {maxBetValue: newMaxBetValue, stake: newStake} = props;

        let value = this.state.value;
        if (oldStake !== newStake) {
            value = newStake > 2 * newMaxBetValue ? newMaxBetValue : newMaxBetValue / 2;
        }

        if (oldMaxBetValue !== newMaxBetValue && value > newMaxBetValue) {
            value = newMaxBetValue;
        }

        if (value !== this.state.value) {
            this.setState({value});
        }
    }

    setNumber(num: number) {
        if (num < MIN_NUMBER_DICE_1) {
            num =  MIN_NUMBER_DICE_1;
        } else if (num > MAX_NUMBER_DICE_1) {
            num = MAX_NUMBER_DICE_1;
        }

        this.setState({num})

    }

    onNumberChange = (num: number) => {
        this.setNumber(num);
    };

    onValueChange = (value: number) => {
        this.setState({value});
    };

    onMultiplierChange = (multiplier: number) => {
        const {reversedRoll} = this.state;
        const num = calcNumberFromPayOutMultiplier(multiplier, reversedRoll);
        this.setNumber(num);
    };

    onChanceChange = (chance: number) => {
        const {reversedRoll} = this.state;

        const num = reversedRoll ?  RANGE - 1 - RANGE * chance : RANGE * chance;
        this.setNumber(Math.round(num));

    };

    onReverseRoll = () => {
        this.setState({reversedRoll: !this.state.reversedRoll, num: RANGE - 1 - this.state.num})
    };

    placeBet = () => {
        const {onBet} = this.props;
        const {num, value, reversedRoll} = this.state;
        onBet(num, value, reversedRoll); // number is unsafe as > 2^53
    };

    render() {
        const {num, value, reversedRoll} = this.state;
        const {result, showResult, sound, showHelp, onToggleHelp, maxBetValue} = this.props;

        const multiplier = calcPayOutMultiplier(num, reversedRoll);
        const profit = multiplier * value;
        const chance = calcChance(num, reversedRoll);
        const maxPayoutMultiplier = calcPayOutMultiplier(MIN_NUMBER_DICE_1, false);
        const minPayoutMultiplier = calcPayOutMultiplier(MAX_NUMBER_DICE_1, false);


        const reverseButton = <ReverseRollButton reversed={reversedRoll} onClick={this.onReverseRoll}/>;

        return (
            <div className={Style.diceUi}>
                <div className={"form-row"} style={{alignItems: 'flex-end'}}>
                    <Col sm={6} xs={12}>
                        <FormGroup className="games__form-group">
                            <Label>Bet Amount(ETH)</Label>
                            <ValueInput value={value} min={MIN_BET_VALUE} step={MIN_BET_VALUE} max={maxBetValue} onChange={this.onValueChange}/>
                        </FormGroup>
                    </Col>
                    <Col sm={6} xs={6}>
                        <FormGroup className="games__form-group">
                            <Label>Profit on Win(ETH)</Label>
                            {/*<span><Ether value={payOut}/></span>*/}
                            <Input disabled readOnly value={formatEth(profit - value)}/>
                        </FormGroup>
                    </Col>
                    <Col xs={6} sm={4}>
                        <FormGroup className="games__form-group">
                            <Label>{reversedRoll ? "Bet over" : "Bet under"}</Label>
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
                    <Col xs={6} sm={4}>
                        <FormGroup className="games__form-group">
                            <Label>PayOut</Label>
                            <NumericInput
                                number={multiplier}
                                suffix='x'
                                precision={3}
                                min={minPayoutMultiplier}
                                max={maxPayoutMultiplier}
                                onNumber={this.onMultiplierChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={6} sm={4}>
                        <FormGroup className="games__form-group">
                            <Label>Win chance</Label>
                            <NumericInput
                                number={chance * 100}
                                suffix='%'
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
                    <DiceSlider
                        num={num}
                        onNumberChange={this.onNumberChange}
                        showResult={showResult}
                        result={result}
                        sound={sound}
                        reversedRoll={reversedRoll}
                    />
                </Row>
                <Row noGutters>
                    <Button block color="primary" onClick={this.placeBet}>Roll Dice</Button>
                </Row>
                <Modal isOpen={showHelp} toggle={onToggleHelp}>
                        <HowToPlay/>
                </Modal>
            </div>
        );
    }
}
