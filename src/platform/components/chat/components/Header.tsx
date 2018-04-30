import * as React from 'react';
import {FontAwesomeIcon} from '../../../../reusable/index';

const Style = require('./Header.scss');

type Props = {
    onClose(): void,
    onToggleFriends(b: boolean): void
}

const Header = ({onClose, onToggleFriends} : Props) => (
    <div className={Style.header}>
        <span className={Style.toggleFriends} onClick={() => onToggleFriends(true)}>
            <FontAwesomeIcon icon="user"/>
        </span>
        <span className={Style.title} onClick={() => onToggleFriends(false)}>
            <FontAwesomeIcon icon="comments"/>
            Chat
        </span>
        <button className={'close'} aria-label="Close Chat" onClick={onClose}>
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
);

export default Header;
