import ClassNames from "classnames";
import * as React from "react";

import * as Style from "./ResultSlider.scss";

type Props = {
    result: {num: number; won: boolean};
    showResult: boolean;
};

export default class ResultSlider extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {result, showResult} = this.props;
        const {won, num} = result;

        const classNames = ClassNames(
            Style.resultSlider,
            {[Style.resultSlider_visible]: showResult},
            {[Style.resultSlider_hidden]: !showResult},
        );

        const classNamesWrapper = ClassNames(Style.resultWrapper, {[Style.resultWrapper_hidden]: !showResult});

        const classNamesResult = ClassNames(Style.result, {[Style.result_won]: won}, {[Style.result_lost]: !won});

        return (
            <div className={classNames} style={{transform: `translate(${num}%, -50%)`}}>
                <div className={classNamesWrapper}>
                    <div className={Style.image} />
                    <span className={classNamesResult}>{num}</span>
                </div>
            </div>
        );
    }
}
