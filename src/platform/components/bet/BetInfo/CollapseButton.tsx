import * as React from "react";

import Icon from "../../../../reusable/FontAwesomeIcon";
import {Button} from "../../../../reusable/index";

import * as Style from "./CollapsButton.scss";

interface Props {
    isOpen: boolean;
    onClick: React.MouseEventHandler<any>;
    name: string;
}

const CollapseButton = ({name, isOpen, onClick}: Props) => {
    return (
        <Button color="link" block onClick={onClick}>
            <span>{name}</span>
            <Icon className={Style.arrow} icon="angle-down" size="lg" rotation={isOpen ? 180 : undefined} />
        </Button>
    );
};

export default CollapseButton;
