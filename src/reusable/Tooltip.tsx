import * as React from 'react';
import {UncontrolledTooltip as BootstrapTooltip} from 'reactstrap';

import {BaseType} from "./BaseType";

export type Func = () => HTMLElement | string | null;

export interface Props extends BaseType {
    children: React.ReactNode,
    container?: string,
    target: string | HTMLElement | Func,
    placement?: 'auto' | 'top' | 'right' | 'bottom' | 'left',
    autohide?: boolean

}

const Tooltip = ({target, ...rest}: Props) => (
    <BootstrapTooltip
        target={target as any}
        {...rest}
    />
);

export default Tooltip;
