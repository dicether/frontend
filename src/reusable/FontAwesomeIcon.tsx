import * as React from 'react';
import ClassNames from 'classnames';
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon, {Props as FontAwesomeProps} from '@fortawesome/react-fontawesome';
import freeSolid from '@fortawesome/fontawesome-free-solid'

const Style = require('./FontAwesomeIcon.scss');


fontawesome.library.add(freeSolid);


export interface Props extends FontAwesomeProps {
    color?: string;
}

const Icon = ({color, ...rest}: Props) => {
    const className = ClassNames({
            [Style[`icon-${color}`]]: color !== undefined
        }
    );

    return (
        <span className={className}>
            <FontAwesomeIcon {...rest}/>
        </span>
    );
};

export default Icon;
