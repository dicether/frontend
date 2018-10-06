import {IconProp} from "@fortawesome/fontawesome-svg-core";
import ClassName from "classnames";
import * as React from "react";
import FontAwesomeIcon, {Props as FontAwesomeIconProps} from "./FontAwesomeIcon";

import "./IconButton.scss";

export interface Props extends FontAwesomeIconProps {
    id?: any;
    icon: IconProp;
    onClick: React.MouseEventHandler<any>;
    color?: string;
    buttonClassName?: string;
}

const IconButton = ({onClick, color = "primary", id, buttonClassName, ...rest}: Props) => {
    const buttonClassNames = ClassName("iconButton", "iconButton_" + color, buttonClassName);

    return (
        <button className={buttonClassNames} onClick={onClick} id={id}>
            <FontAwesomeIcon {...rest} />
        </button>
    );
};

export default IconButton;
