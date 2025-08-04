import RcSlider from "rc-slider";
import * as React from "react";

import {BaseType} from "./BaseType";

import "rc-slider/assets/index.css";
import "./Slider.scss";
import * as Style from "./Slider.scss";

export interface Props extends BaseType {
    value: number;
    min: number;
    max: number;
    step?: number;
    vertical?: boolean;
    disabled?: boolean;
    lowColor?: string;
    highColor?: string;

    onValue: (value: number) => void;
}

const Slider = ({lowColor, highColor, onValue, ...props}: Props) => {
    const trackStyle = lowColor !== undefined ? {backgroundColor: Style[lowColor]} : {};
    const railStyle = highColor !== undefined ? {backgroundColor: Style[highColor]} : {};

    type OnValueFunc = (value: number | number[]) => void;
    return <RcSlider onChange={onValue as OnValueFunc} {...props} trackStyle={trackStyle} railStyle={railStyle} />;
};

export default Slider;
