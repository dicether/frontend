import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";

import {MIN_BET_VALUE} from "../../../../config/config";
import {Button, Col, FormGroup, Label, Modal, Row, Select, ValueInput} from "../../../../reusable";
import {popCnt} from "../../../../util/math";
import HowToPlay from "./HowToPlay";
import Plinko from "./Plinko";

import Style from "./Ui.scss";

export interface Props extends WithTranslation {
    disableRiskRowUpdate: boolean;
    ref: any;
    rows: number;
    risk: number;
    value: number;
    maxBetValue: number;
    result: {betNum: number; num: number; won: boolean; userProfit: number};
    showResult: boolean;
    showHelp: boolean;
    nightMode: boolean;
    onRiskChange(risk: number): void;
    onRowsChange(rows: number): void;
    onToggleHelp(): void;
    onValueChange(value: number): void;
    onPlaceBet(): void;
}

export type State = {
    angle: number;
};

class Ui extends React.PureComponent<Props, State> {
    public plinko = React.createRef<Plinko>();

    constructor(props: Props) {
        super(props);

        this.state = {
            angle: 0,
        };
    }

    /* tslint:disable:no-unused-variable */
    private onSimulate = () => {
        this.plinko.current?.simulate();
    };

    render() {
        const {
            disableRiskRowUpdate,
            value,
            rows,
            risk,
            maxBetValue,
            result,
            showResult,
            showHelp,
            nightMode,
            onToggleHelp,
            onValueChange,
            onRiskChange,
            onRowsChange,
            onPlaceBet,
            t,
        } = this.props;

        const resultCol = popCnt(result.num); // TODO: Move up to plinko?

        return (
            <div>
                <Row noGutters>
                    <Col className={Style.plinko} lg={{size: 7, order: 2}} xl={{size: 8, order: 2}}>
                        <Plinko
                            ref={this.plinko}
                            rows={rows}
                            risk={risk}
                            nightMode={nightMode}
                            showResult={showResult}
                            resultColumn={resultCol}
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
                            <Row noGutters>
                                <Col xs={{size: 8}} sm={{size: 12}}>
                                    <FormGroup>
                                        <Label>{t("risk")}</Label>
                                        <Select
                                            disabled={disableRiskRowUpdate}
                                            value={risk.toString()}
                                            onValue={(val) => onRiskChange(Number.parseInt(val, 10))}
                                        >
                                            <option value={1}>{t("lowRisk")}</option>
                                            <option value={2}>{t("mediumRisk")}</option>
                                            <option value={3}>{t("highRisk")}</option>
                                        </Select>
                                    </FormGroup>
                                </Col>
                                <Col xs={{size: 4}} sm={{size: 12}}>
                                    <FormGroup>
                                        <Label>{t("rows")}</Label>
                                        <Select
                                            disabled={disableRiskRowUpdate}
                                            value={rows.toString()}
                                            onValue={(val) => onRowsChange(Number.parseInt(val, 10))}
                                        >
                                            <option value={8}>8</option>
                                            <option value={12}>12</option>
                                            <option value={16}>16</option>
                                        </Select>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button className="betButton" block color="success" onClick={onPlaceBet}>
                                {t("bet")}
                            </Button>
                            {/*<Button className="betButton" block color="warning" onClick={this.onSimulate}>*/}
                            {/*    {t("simulate")}*/}
                            {/*</Button>*/}
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

export default withTranslation(undefined, {withRef: true})(Ui);
