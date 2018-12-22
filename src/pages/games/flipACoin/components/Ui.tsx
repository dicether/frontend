import * as React from "react";
import {HOUSE_EDGE, HOUSE_EDGE_DIVISOR, MIN_BET_VALUE} from "../../../../config/config";
import {Button, Col, FormGroup, Input, Label, Modal, Row, ValueInput} from "../../../../reusable";
import {formatEth} from "../../../../reusable/Ether";
import Coins from "./Coins";
import HowToPlay from "./HowToPlay";

const Style = require("./Ui.scss");

type Props = {
    value: number;
    num: number;
    maxBetValue: number;
    result: {num: number; won: boolean};
    showResult: boolean;
    showHelp: boolean;
    onToggleHelp(): void;
    onValueChange(value: number): void;
    onClick(diceNum: number): void;
    onPlaceBet(): void;
};

class Ui extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {
            value,
            maxBetValue,
            showHelp,
            result,
            showResult,
            num,
            onToggleHelp,
            onValueChange,
            onPlaceBet,
            onClick,
        } = this.props;

        const houseEdgeFactor = 1 - HOUSE_EDGE / HOUSE_EDGE_DIVISOR;
        const payout = 2 * value * houseEdgeFactor;

        return (
            <div className={Style.dice}>
                <div className={Style.ui}>
                    <Coins selectedCoin={num} result={result} showResult={showResult} onClick={onClick} />
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
                        <Col sm={6} xs={12}>
                            <FormGroup className="games__form-group">
                                <Label>Profit on win (ETH)</Label>
                                <Input disabled readOnly value={formatEth(payout - value)} />
                            </FormGroup>
                        </Col>
                    </div>
                    <Row noGutters>
                        <Button className="betButton" block color="success" onClick={onPlaceBet}>
                            Flip the coin
                        </Button>
                    </Row>
                    <Modal isOpen={showHelp} toggle={onToggleHelp}>
                        <HowToPlay />
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Ui;
