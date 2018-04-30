import * as React from 'react';
import ClassNames from 'classnames';

import {BaseType} from "./BaseType";

const Style = require('./StaticPopover.scss');

export interface Props extends BaseType {
    placement: 'top' | 'bottom' | 'right' | 'left',
    children: React.ReactNode,
    title?: string,
    className?: string
}

const StaticPopover = ({placement, children, title, className}: Props) => {
    const popoverClassName = ClassNames(
        'popover',
        {'bs-popover-top': placement === 'top'},
        {'bs-popover-bottom': placement === 'bottom'},
        {'bs-popover-right': placement === 'right'},
        {'bs-popover-left': placement === 'left'},
        Style.popover,
        className,

    );

    const arrowClassName = ClassNames(
        'arrow',
        {[Style.popover__arrow_top]: placement === 'bottom'},
        {[Style.popover__arrow_bottom]: placement === 'top'},
        {[Style.popover__arrow_right]: placement === 'left'},
        {[Style.popover__arrow_left]: placement === 'right'},

    );

    return (
        <div className={popoverClassName}>
            <div className={arrowClassName}/>
            <div className="popover-body">
                {children}
            </div>

        </div>
    );
};

export default StaticPopover;
