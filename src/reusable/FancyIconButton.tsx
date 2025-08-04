import {IconProp} from "@fortawesome/fontawesome-svg-core";
import ClassName from "classnames";
import * as React from "react";

import FontAwesomeIcon, {Props as FontAwesomeIconProps} from "./FontAwesomeIcon";

import "./FancyIconButton.scss";

export interface Props extends FontAwesomeIconProps {
    id?: any;
    icon: IconProp;
    onClick: React.MouseEventHandler<any>;
    color?: string;
    buttonClassName?: string;
}

const FancyIconButton = ({onClick, color = "primary", id, buttonClassName, ...rest}: Props) => {
    const buttonClassNames = ClassName("fancyIconButton", "fancyIconButton_" + color, buttonClassName);

    const thinCircle = {...rest, icon: ["far", "circle"] as IconProp, transform: "grow-15"};
    return (
        <button className={buttonClassNames} onClick={onClick} id={id}>
            <span className="fa-layers fa-fw">
                <FontAwesomeIcon {...thinCircle} />
                <FontAwesomeIcon {...rest} />
            </span>
        </button>
    );
};

export default FancyIconButton;
