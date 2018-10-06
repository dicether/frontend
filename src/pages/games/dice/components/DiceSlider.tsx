import * as React from "react";
import {MAX_NUMBER_DICE_1, MIN_NUMBER_DICE_1} from "../../../../config/config";
import {Slider} from "../../../../reusable/index";
import sounds from "../../sound";
import ResultSlider from "./ResultSlider";
import Ticks from "./Ticks";

type Props = {
    num: number;
    result: {num: number; won: boolean};
    showResult: boolean;
    sound: boolean;
    reversedRoll: boolean;

    onNumberChange(n: number): void;
};

export default class DiceSlider extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    onChange = (newNum: number) => {
        if (newNum >= MIN_NUMBER_DICE_1 && newNum <= MAX_NUMBER_DICE_1) {
            const {sound, num} = this.props;

            if (sound) {
                if (newNum > num) {
                    sounds.menuUp.playFromBegin();
                } else if (newNum < num) {
                    sounds.menuDown.playFromBegin();
                }
            }
            this.props.onNumberChange(newNum);
        }
    }

    render() {
        const {result, showResult, reversedRoll, num} = this.props;
        const lowColor = reversedRoll ? "danger" : "success";
        const highColor = reversedRoll ? "success" : "danger";

        return (
            <div style={{position: "relative", width: "100%", marginTop: "3em", marginBottom: "1em"}}>
                <Ticks />
                <div style={{width: "100%", position: "relative", left: "0%"}}>
                    <Slider
                        min={0}
                        max={100}
                        value={num}
                        onValue={this.onChange}
                        lowColor={lowColor}
                        highColor={highColor}
                    />
                </div>
                <ResultSlider result={result} showResult={showResult} />
            </div>
        );
    }
}
