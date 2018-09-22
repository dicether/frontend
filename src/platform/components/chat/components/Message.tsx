import * as React from 'react';
import {emojify} from 'react-emojione';
import {Link} from "react-router-dom";
import ClassNames from 'classnames';
import moment from 'moment';

import {Dropdown, Popover} from '../../../../reusable/index';
import UserType from './UserType';
import UserToolTip from './UserMenu';
import Bet from '../../bet/Bet';
import {Message as MessageType} from '../../../modules/chat/types';
import {Friend} from '../../../modules/friends/types';

const reactStringReplace = require('react-string-replace');
const Style = require('./Message.scss');
const emojioneImage = require('assets/images/emojione-3.1.2-64x64.png');


function processMessage(message: string) {
    const betRegex = /Bet:(\d+)/;
    const linkRegex = /(https?:\/\/\S+)/;
    const host = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    const localLinkRegex = new RegExp(`${host}/(\\S+)`);

    const res1 = reactStringReplace(message, betRegex, (match) => (
        <Bet betId={match}/>
    ));

    const res2 = reactStringReplace(res1, localLinkRegex, (match) => (
        <Link to={match}>{`${host}/${match}`}</Link>
    ));

    return reactStringReplace(res2, linkRegex, (match) => (
        <a href={match}>{match}</a>
    ));
}


export type Props = {
    message: MessageType,
    friends: Array<Friend>
};

export type State = {
    showUserPopover: boolean
}

class Message extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showUserPopover: false
        }
    }

    toggleUserPopover = () => {
        this.setState({
            showUserPopover: !this.state.showUserPopover
        })
    };

    render() {
        const {message, friends} = this.props;
        const {user} = message;
        const {showUserPopover} = this.state;

        const messageClass = ClassNames(
            Style.message,
            {
                [Style.message_bot]: user.userType === 'BOT'
            }
        );

        const usernameClass = ClassNames(
            Style.username,
            {
                [Style.username_friend]: typeof friends.find((friend) => friend.user.address === user.address) !== 'undefined'
            }
        );

        return (
            <div id={`messageEntry${message.timestamp}`} className={Style.messageEntry}>
                <div style={{minWidth: 0}}>
                    <div className={Style.user}>
                        <UserType userType={user.userType}/>
                        {user.userType !== 'BOT' ?
                            <Dropdown button={<span className={usernameClass}>{user.username}:</span>}>
                                <UserToolTip user={user}/>
                            </Dropdown>
                            :
                            <span className={usernameClass}>{user.username}:</span>
                        }
                    </div>
                    <span className={messageClass}>{processMessage(emojify(message.message, {
                        style: {
                            backgroundImage: `url(${emojioneImage})`,
                            height: '20px',
                            width: '20px'
                        }
                    }))}</span>
                </div>
                <span className={Style.time}>
                {moment(message.timestamp).format('HH:mm')}
            </span>
            </div>
        );
    }
}

export default Message;
