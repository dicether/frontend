import * as React from 'react';
import {InputGroup, InputGroupAddon} from 'reactstrap';
import NumericInput from './NumericInput';
import Button from './Button';
import {BaseType} from "./BaseType";


export interface Props extends BaseType {
    value: number,
    min: number,
    max: number,
    step?: number,
    onChange(value: number): void;
}

const ETHER_DIV = 1e9;

export default class ValueInput extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    onValueChange = (value: number) => {
        const {onChange, min, max} = this.props;
        let newVal = Math.round(value * ETHER_DIV);
        if (newVal < min) {
            newVal = min;
        } else if (newVal > max) {
            newVal = max;
        }

        onChange(newVal);
    };

    onValueDouble = (value: number) => {
        const {max, onChange, step} = this.props;

        let newVal = value * 2;

        if (step !== undefined) {
            newVal = Math.round(newVal / step) * step;
        }
        if (newVal > max ) {
            newVal = max;
        }
        onChange(newVal);
    };

    onValueHalf = (value: number) => {
        const {min, onChange, step} = this.props;

        let newVal = value / 2;
        if (step !== undefined) {
            newVal = Math.round(newVal / step) * step;
        }
        if (newVal < min ) {
            newVal = min;
        }
        onChange(newVal);
    };

    render() {
        const {value, min, max} = this.props;
        return (
            <InputGroup>
                <NumericInput
                    className={'form-control'}
                    step={min / ETHER_DIV}
                    min={min / ETHER_DIV}
                    max={max / ETHER_DIV}
                    number={value / ETHER_DIV}
                    onNumber={this.onValueChange}
                />
                <InputGroupAddon addonType="append">
                    <Button color="secondary" onClick={() => this.onValueHalf(value)}>1/2</Button>
                    <Button color="secondary" onClick={() => this.onValueDouble(value)}>2X</Button>
                </InputGroupAddon>
            </InputGroup>
        );
    }
}
