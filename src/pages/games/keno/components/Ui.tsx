import {getNumSetBits, getSetBits} from "@dicether/state-channel";
import BN from "bn.js";
import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";

import {MIN_BET_VALUE} from "../../../../config/config";
import {Button, Col, Ether, FormGroup, Label, Modal, Row, ValueInput} from "../../../../reusable";
import Grid from "./Grid";
import HowToPlay from "./HowToPlay";
import PayoutTable from "./PayoutTable";

import * as Style from "./Ui.scss";

export interface Props extends WithTranslation {
    num: number;
    value: number;
    maxBetValue: number;
    result: {betNum: number; num: number; won: boolean; userProfit: number};
    showResult: boolean;
    showResultProfit: boolean;
    showHelp: boolean;
    onToggleHelp(): void;
    onValueChange(value: number): void;
    onClick(diceNum: number): void;
    onAutoPick(): void;
    onClear(): void;
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
            showResultProfit,
            showHelp,
            onToggleHelp,
            onValueChange,
            onClick,
            onAutoPick,
            onClear,
            onPlaceBet,
            t,
        } = this.props;
        const selectedTilesArray = getSetBits(num);
        const numSelectedTiles = getNumSetBits(num);
        const hits = getNumSetBits(new BN(result.num).and(new BN(num)).toNumber());

        return (
            <div className={Style.ui}>
                <Row noGutters>
                    <Col lg={{size: 7, order: 2}} xl={{size: 8, order: 2}}>
                        <div className={Style.grid}>
                            <Grid
                                onClick={onClick}
                                selectedTiles={selectedTilesArray}
                                result={result}
                                showResult={showResult}
                            />
                            {showResultProfit && result.userProfit > 0 && (
                                <div className={Style.resultPopover}>
                                    <span className={Style.resultDetails}>
                                        {hits} out of {numSelectedTiles}!
                                    </span>
                                    <span>
                                        You have won <Ether precision={6} gwei={result.userProfit} /> ETH!
                                    </span>
                                </div>
                            )}
                        </div>
                        <PayoutTable selectedTiles={numSelectedTiles} numHits={showResult ? hits : undefined} />
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
                            <div className="d-grid gap-2">
                                <Button color="primary" onClick={onAutoPick} disabled={showResult}>
                                    {t("autoPick")}
                                </Button>
                                <Button color="primary" onClick={onClear} disabled={showResult}>
                                    {t("clear")}
                                </Button>
                                <Button className="betButton" color="success" onClick={onPlaceBet}>
                                    {t("bet")}
                                </Button>
                            </div>
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

export default withTranslation()(Ui);
