import * as React from 'react';
import ClassNames from 'classnames';

import {Button} from '../../../../reusable/index';

const Style = require('./CollapsButton.scss');

type Props = {
    isOpen: boolean,
    onClick: React.MouseEventHandler<any>,
    name: string
}

const CollapseButton = ({name, isOpen, onClick}: Props) => {
    const classNames = ClassNames(
        "fa fa-angle-down fa-lg",
        Style.button__arrow,
        {[Style.button__arrow_open]: isOpen},
        {[Style.button__arrows_closed]: !isOpen}
    );

    return (
        <Button color="link" block onClick={onClick}>
            {name} <i className={classNames} aria-hidden="true"/>
        </Button>
    );
};

export default CollapseButton;
