import * as React from "react";
import {Input} from "reactstrap";

import {BaseType} from "./BaseType";

interface Props extends BaseType {
    value: string;
    onValue(value: string): void;
}

class Select extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    private handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const {onValue} = this.props;
        const target = event.target as HTMLInputElement;
        const val = target.value;
        target.blur();
        onValue(val);
    }

    public render() {
        const {value, onValue, ...rest} = this.props;

        return <Input value={value} type="select" onChange={this.handleChange} {...rest} />;
    }
}

export default Select;
