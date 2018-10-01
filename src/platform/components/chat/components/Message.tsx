import * as React from 'react';
import {emojify} from 'react-emojione';
import {Link} from "react-router-dom";
import ClassNames from 'classnames';
import moment from 'moment';

import UserType from './UserType';
import UserMenu from './UserMenu';
import Bet from '../../bet/Bet';
import {Message as MessageType} from '../../../modules/chat/types';
import {Friend} from '../../../modules/friends/types';
import User from "../../user/User";

const reactStringReplace = require('react-string-replace');
const Style = require('./Message.scss');
const emojioneImage = require('assets/images/emojione-3.1.2-64x64.png');


const BET_REGEX = /Bet:(\d+)/;
const USER_REGEX = /User:(\S+)/;
const LINK_REGEX = /(https?:\/\/\S+)/;
const PORT = window.location.port ? `:${window.location.port}` : "";
const HOST = `${window.location.protocol}//${window.location.hostname}${PORT}`;
const LOCAL_LINK_REGEX = new RegExp(`${HOST}/(\\S+)`);


type ChatButtonProps = {
    name: string,
    onClick?: any
}

const ChatButton = ({name, onClick}: ChatButtonProps) => (
    <button className={Style.message_button} onClick={onClick}>{name}</button>
);


function processMessage(message: string) {
    let res = reactStringReplace(message, BET_REGEX, (match, i) => (
        <Bet key={match + i} betId={match} button={<ChatButton name={`Bet:${match}`}/>}/>
    ));

    res = reactStringReplace(res, USER_REGEX, (match, i) => (
        <User key={match + i} userName={match} button={<ChatButton name={`User:${match}`}/>} />
    ));

    res = reactStringReplace(res, LOCAL_LINK_REGEX, (match, i) => (
        <Link key={match + i} to={`/${match}`}>{`${HOST}/${match}`}</Link>
    ));

    return reactStringReplace(res, LINK_REGEX, (match, i) => (
        <a key={match + i} href={match}>{match}</a>
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

        const userName = <span className={usernameClass}>{user.username}:</span>;

        return (
            <div id={`messageEntry${message.timestamp}`} className={Style.messageEntry}>
                <div style={{minWidth: 0}}>
                    <div className={Style.user}>
                        <UserType userType={user.userType}/>
                        {user.userType !== 'BOT' ?
                            <UserMenu user={user} messageId={message.id} button={userName}/>
                            :
                            {userName}
                        }
                    </div>
                    {!message.deleted ?
                        <span className={messageClass}>{
                            processMessage(emojify(message.message, {
                                style: {
                                    backgroundImage: `url(${emojioneImage})`,
                                    height: '20px',
                                    width: '20px'
                                }
                            }))
                        }</span>
                        :
                        <span>[removed]</span>
                    }
                </div>
                <span className={Style.time}>
                    {moment(message.timestamp).format('HH:mm')}
                </span>
            </div>
        );
    }
}

export default Message;
