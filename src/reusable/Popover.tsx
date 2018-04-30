import * as React from 'react';
import {Popover as BootstrapPopover, PopoverBody} from 'reactstrap'

import {BaseType} from "./BaseType";
import {Placement} from "reactstrap/lib/Popper";

export interface Props extends BaseType {
    id?: string,
    children: React.ReactNode,
    isOpen: boolean,
    placement?: Placement,
    container?: any,
    target: string

    toggle(): void,
}


const Popover = ({id, isOpen, toggle, children, container, placement = "auto", target, ...rest}: Props) => (
    <BootstrapPopover
        id={id}
        isOpen={isOpen}
        toggle={toggle}
        container={container}
        placement={placement}
        style={{'zIndex': 20000, 'maxWidth': '100rem'}}
        {...rest}
        target={target}
    >
        <PopoverBody>{children}</PopoverBody>
    </BootstrapPopover>
);

export default Popover;
