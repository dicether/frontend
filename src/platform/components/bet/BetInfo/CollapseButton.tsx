import ClassNames from "classnames";
import * as React from "react";

import Icon from "../../../../reusable/FontAwesomeIcon";
import {Button} from "../../../../reusable/index";

const Style = require("./CollapsButton.scss");

type Props = {
    isOpen: boolean;
    onClick: React.MouseEventHandler<any>;
    name: string;
};

const CollapseButton = ({name, isOpen, onClick}: Props) => {
    const classNames = ClassNames(
        "fa fa-angle-down fa-lg",
        Style.button__arrow,
        {[Style.button__arrow_open]: isOpen},
        {[Style.button__arrows_closed]: !isOpen}
    );

    return (
        <Button color="link" block onClick={onClick}>
            <span>{name}</span>
            <Icon className={Style.arrow} icon="angle-down" size="lg" rotation={isOpen ? 180 : undefined} />
        </Button>
    );
};

export default CollapseButton;
