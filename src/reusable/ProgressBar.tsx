import * as React from "react";
import {Progress} from "reactstrap";

import {BaseType} from "./BaseType";

import "./ProgressBar.scss";

export interface Props extends BaseType {
    value: number;
    lowColor: string;
    highColor: string;
}

const ProgressBar = ({value, lowColor, highColor, ...rest}: Props) => (
    <Progress multi {...rest}>
        <Progress bar value={value} color={lowColor} />
        {highColor && <Progress bar value={100 - value} color={highColor} />}
    </Progress>
);

export default ProgressBar;
