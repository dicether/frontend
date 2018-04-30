import * as React from 'react'

import Input from './Input';
import {filterFloat} from '../util/math';
import {BaseType} from "./BaseType";


export interface Props extends BaseType {
    number: number,
    min: number,
    max: number,
    step?: number,
    precision?: number,
    suffix?: React.ReactNode

    onNumber(n: number): void,
}


export default class NumericInput extends React.Component<Props> {
    static defaultProps = {
        min: Number.MIN_VALUE,
        max: Number.MAX_VALUE
    };

    constructor(props: Props) {
        super(props);
    }

    validate = (value: string)  => {
        const {min, max} = this.props;

        const num = filterFloat(value);
        if (Number.isNaN(num)) {
            return {valid: false, message: 'Not a number!'};
        } else if (num < min) {
            return {valid: false, message: 'To low!'};
        } else if (num > max) {
            return {valid: false, message: 'To high!'};
        } else {
            return {valid: true};
        }
    };

    onValue = (value: string) => {
        const {step, onNumber} = this.props;

        let num = filterFloat(value);
        if (step !== undefined) {
            num = Math.round(num / step) * step;
        }

        onNumber(num);
    };

    render() {
        const {number, precision, suffix} = this.props; // tslint:disable-line variable-name
        const value = (precision !== undefined) ? number.toFixed(precision) : number.toString();

        return (
            <Input suffix={suffix} value={value} validate={this.validate} onValue={this.onValue}/>
        )
    }
}
