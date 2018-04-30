import * as React from 'react';
import ClassNames from 'classnames';

const Style = require('./Input.scss');
import {BaseType} from "./BaseType";


export interface Props extends BaseType {
    value: string,
    suffix?: React.ReactNode,
    disabled?: boolean,
    readOnly?: boolean,
    placeholder?: string,
    showValidation?: boolean,
    isValid?: boolean

    validate?(value: string): {valid: boolean, message?: string},
    onValue?(value: string): void,
}

export type State = {
    inputValue: string,
    isValid: boolean|null
};


export default class Input extends React.Component<Props, State> {
    static defaultProps = {
        disabled: false,
        showValidation: false
    };

    isFocus: boolean;

    constructor(props: Props) {
        super(props);

        if (props.isValid !== undefined && props.validate !== undefined) {
            console.error("isValid and validate cant't be used at the same time!")
        }

        this.isFocus = false;

        this.state = {
            inputValue: this.props.value,
            isValid: null
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        const {value} = this.props;
        if (!this.isFocus && value !== nextProps.value) {
            this.setState({inputValue: nextProps.value});
        }
    }

    onBlur = (event: React.FormEvent<HTMLInputElement>) => {
        const {onValue, validate, value} = this.props;
        const val = (event.target as HTMLInputElement).value;

        if (onValue && (validate === undefined || validate(val).valid)) {
            onValue(val);
        }
        this.setState({inputValue: value, isValid: true});
        this.isFocus = false;
    };

    onFocus = () => {
        this.isFocus = true;
    };

    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        const val = (event.target as HTMLInputElement).value;
        const {onValue, validate} = this.props;

        const valid = validate === undefined || validate(val).valid;
        this.setState({inputValue: val, isValid: valid});
        if (onValue && valid) {
            onValue(val);
        }
    };

    render() {
        const {inputValue, isValid: isValidState} = this.state;
        const {suffix, disabled, readOnly, placeholder, showValidation, isValid: isValidProp} = this.props;

        let isValid: boolean | null = null;
        if (typeof(isValidProp) !== "undefined") {
            isValid = isValidProp;
        } else if (isValidState !== null) {
            isValid = isValidState;
        }

        const className = ClassNames(
            'form-control',
            Style.input__input,
            {'is-valid': isValid !== null && isValid && showValidation},
            {'is-invalid': isValid !== null && !isValid && showValidation},
        );

        return (
            <div className="input">
                <input placeholder={placeholder}
                       className={className}
                       disabled={disabled}
                       readOnly={readOnly}
                       value={inputValue}
                       onBlur={this.onBlur}
                       onChange={this.onChange}
                       onFocus={this.onFocus}
                />
                {suffix &&
                <div className="input__suffix">
                    <span style={{color: 'transparent'}}>{inputValue}</span>
                    {suffix}
                </div>
                }

            </div>
        )
    }
}
