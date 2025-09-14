import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon, FontAwesomeIconProps} from "@fortawesome/react-fontawesome";
import ClassNames from "classnames";
import * as React from "react";

import * as Style from "./FontAwesomeIcon.scss";

library.add(fas, far);

export interface Props extends FontAwesomeIconProps {
    color?: string;
}

const Icon = ({color, className, ...rest}: Props) => {
    const classNames = ClassNames(className, {
        [Style[`icon-${color}`]]: color !== undefined,
    });

    return <FontAwesomeIcon {...rest} className={classNames} />;
};

export default Icon;
