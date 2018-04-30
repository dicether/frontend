import * as React from 'react';
import {emojify} from 'react-emojione';
import ClassNames from 'classnames';
import moment from 'moment';

import {Popover} from '../../../../reusable/index';
import UserType from './UserType';
import UserToolTip from './UserTooltip';

import {Message as MessageType} from '../../../modules/chat/types';
import {Friend} from '../../../modules/friends/types';

const Style = require('./Message.scss');
const emojioneImage = require('assets/images/emojione-3.1.2-64x64.png');


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
                        {user.userType !== 'BOT' ? [
                                <span
                                    key="1"
                                    id={`messagePopover${message.timestamp}`}
                                    onClick={this.toggleUserPopover}
                                    className={usernameClass}>
                                        {user.username}:
                                </span>,
                                <Popover
                                    key="2"
                                    target={`messagePopover${message.timestamp}`}
                                    placement="top"
                                    isOpen={showUserPopover}
                                    toggle={this.toggleUserPopover}>
                                    <UserToolTip user={user}/>
                                </Popover>
                            ]
                            :
                            <span className={usernameClass}>{user.username}:</span>
                        }
                    </div>
                    <span className={messageClass}>{emojify(message.message, {
                        style: {
                            backgroundImage: `url(${emojioneImage})`,
                            height: '20px',
                            width: '20px'
                        }
                    })}</span>
                </div>
                <span className={Style.time}>
                {moment(message.timestamp).format('HH:mm')}
            </span>
            </div>
        );
    }
}

export default Message;
