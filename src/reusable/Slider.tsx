import RcSlider from "rc-slider";
import * as React from "react";

const SliderHandle = require("./SliderHandle").default;
import {BaseType} from "./BaseType";

import "rc-slider/assets/index.css"; // tslint:disable-line:no-submodule-imports
import "./Slider.scss";
const Style = require("./Slider.scss");

export interface Props extends BaseType {
    value: number;
    min: number;
    max: number;
    step?: number;
    vertical?: boolean;
    disabled?: boolean;
    lowColor?: string;
    highColor?: string;

    onValue(value: number): void;
}

const Slider = ({lowColor, highColor, onValue, ...props}: Props) => {
    let trackStyle = {};
    let railStyle = {};

    if (lowColor !== undefined) {
        trackStyle = {backgroundColor: Style[lowColor]};
    }

    if (highColor !== undefined) {
        railStyle = {backgroundColor: Style[highColor]};
    }

    let node: any;

    return (
        <RcSlider
            ref={ref => (node = ref)}
            onChange={onValue}
            {...props}
            trackStyle={trackStyle}
            railStyle={railStyle}
            onBeforeChange={() => node.focus()}
            handle={({index, ...restProps}) => {
                delete restProps.dragging;
                return <SliderHandle {...restProps} key={index} />;
            }}
        />
    );
};

export default Slider;
