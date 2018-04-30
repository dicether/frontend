import * as React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    enabled: boolean,

    size: 'lg' | 'sm',
    colorOn?: string,
    colorOff?: string,
    textOn?: string,
    textOff?: string,

    onToggle(t: boolean): void,
}


const Switch = ({enabled, onToggle, size, colorOn = 'success', colorOff = 'danger', textOn = "On", textOff = 'Off'}: Props) => (
    <ButtonGroup>
        <Button
            size={size}
            outline={!enabled}
            color={enabled ? colorOn : 'secondary'}
            onClick={() => onToggle(true)}
        >
            {textOn}
        </Button>
        <Button
            size={size}
            outline={enabled}
            color={!enabled ? colorOff : 'secondary'}
            onClick={() => onToggle(false)}

        >
            {textOff}
        </Button>
    </ButtonGroup>
);

export default Switch;
