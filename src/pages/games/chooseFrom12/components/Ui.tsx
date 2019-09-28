import * as React from "react";
import {WithNamespaces, withNamespaces} from "react-i18next";

import {CHOOSE_FROM_12_NUMS, getSetBits} from "@dicether/state-channel";
import {HOUSE_EDGE, HOUSE_EDGE_DIVISOR, MIN_BET_VALUE} from "../../../../config/config";
import {Button, Col, FormGroup, Input, Label, Modal, Row, ValueInput} from "../../../../reusable";
import {formatEth} from "../../../../reusable/Ether";
import Grid from "./Grid";
import HowToPlay from "./HowToPlay";

const Style = require("./Ui.scss");

export interface Props extends WithNamespaces {
    num: number;
    value: number;
    maxBetValue: number;
    result: {num: number; won: boolean};
    showResult: boolean;
    showHelp: boolean;
    onToggleHelp(): void;
    onValueChange(value: number): void;
    onClick(diceNum: number): void;
    onPlaceBet(): void;
}

class Ui extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {
            value,
            num,
            maxBetValue,
            result,
            showResult,
            showHelp,
            onToggleHelp,
            onValueChange,
            onClick,
            onPlaceBet,
            t,
        } = this.props;
        const selectedCoinsArray = getSetBits(num);
        const numSelected = selectedCoinsArray.filter(x => x === true).length;
        const chance = numSelected / CHOOSE_FROM_12_NUMS;
        const houseEdgeFactor = 1 - HOUSE_EDGE / HOUSE_EDGE_DIVISOR;
        const payout = (1 / chance) * value * houseEdgeFactor;

        return (
            <div className={Style.ui}>
                <Row noGutters>
                    <Col lg={{size: 7, order: 2}} xl={{size: 8, order: 2}}>
                        <Grid
                            onClick={onClick}
                            selectedCoins={selectedCoinsArray}
                            result={result}
                            showResult={showResult}
                        />
                    </Col>
                    <Col lg={5} xl={4}>
                        <div className={Style.menu}>
                            <FormGroup className="games__form-group">
                                <Label>{t("betAmountEth")}</Label>
                                <ValueInput
                                    value={value}
                                    min={MIN_BET_VALUE}
                                    step={MIN_BET_VALUE}
                                    max={maxBetValue}
                                    onChange={onValueChange}
                                />
                            </FormGroup>
                            <FormGroup className="games__form-group">
                                <Label>{t("profitOnWinEth")}</Label>
                                <Input disabled readOnly value={formatEth(payout - value)} />
                            </FormGroup>
                            <FormGroup className="games__form-group hidden-xs-down">
                                <Label>{t("winChance")}</Label>
                                <Input disabled readOnly value={Math.round(chance * 100).toString()} suffix="%" />
                            </FormGroup>
                            <Button className="betButton" block color="success" onClick={onPlaceBet}>
                                {t("bet")}
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Modal isOpen={showHelp} toggle={onToggleHelp}>
                    <HowToPlay />
                </Modal>
            </div>
        );
    }
}

export default withNamespaces()(Ui);
