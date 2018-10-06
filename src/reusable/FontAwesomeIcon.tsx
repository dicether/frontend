import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon, Props as FontAwesomeProps} from "@fortawesome/react-fontawesome";
import ClassNames from "classnames";
import * as React from "react";

const Style = require("./FontAwesomeIcon.scss");

library.add(fas);

export interface Props extends FontAwesomeProps {
    color?: string;
}

const Icon = ({color, className, ...rest}: Props) => {
    const classNames = ClassNames(className, {
        [Style[`icon-${color}`]]: color !== undefined,
    });

    return <FontAwesomeIcon {...rest} className={classNames} />;
};

export default Icon;
