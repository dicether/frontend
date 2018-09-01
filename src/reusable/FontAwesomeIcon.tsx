import * as React from 'react';
import ClassNames from 'classnames';
import {FontAwesomeIcon, Props as FontAwesomeProps} from '@fortawesome/react-fontawesome';
import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from '@fortawesome/free-solid-svg-icons'

const Style = require('./FontAwesomeIcon.scss');


library.add(fas);


export interface Props extends FontAwesomeProps {
    color?: string;
}

const Icon = ({color, className, ...rest}: Props) => {
    const classNames = ClassNames(
        className,
        {
            [Style[`icon-${color}`]]: color !== undefined
        }
    );

    return (
        <FontAwesomeIcon {...rest} className={classNames}/>
    );
};

export default Icon;
