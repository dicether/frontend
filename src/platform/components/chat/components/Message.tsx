import ClassNames from "classnames";
import dayjs from "dayjs";
import * as React from "react";
import Emoji from "react-emoji-render";
import {Link} from "react-router-dom";

import {Message as MessageType} from "../../../modules/chat/types";
import {Friend} from "../../../modules/friends/types";
import UserMenu from "./UserMenu";
import UserType from "./UserType";

import reactStringReplace from "react-string-replace";
import {isValidUserName} from "../../../modules/account/util";
import Style from "./Message.scss";

const BET_REGEX = /Bet:(\d+)/;
const USER_REGEX = /(?:User:(\S+))/;
const USER_MENTION_REGEX = /(?:^|\s)@(\S+)/;
const LINK_REGEX = /(https?:\/\/\S+)/;
const PORT = window.location.port ? `:${window.location.port}` : "";
const HOST = `${window.location.protocol}//${window.location.hostname}${PORT}`;
const LOCAL_LINK_REGEX = new RegExp(`${HOST}/(\\S+)`);

type ChatButtonProps = {
    name: string;
    onClick?: any;
};

const ChatButton = ({name, onClick}: ChatButtonProps) => (
    <button className={Style.message_button} onClick={onClick}>
        {name}
    </button>
);

function processMessage(
    message: string,
    showBetModal: (betId: number) => void,
    showUserModal: (userName: string) => void
) {
    let res = reactStringReplace(message, BET_REGEX, (match, i) => (
        <ChatButton key={match + i} name={`Bet:${match}`} onClick={() => showBetModal(Number.parseInt(match, 10))} />
    ));

    res = reactStringReplace(res, USER_REGEX, (match, i) => {
        if (!isValidUserName(match)) {
            return `User:${match}`;
        }

        return <ChatButton key={match + i} name={`User:${match}`} onClick={() => showUserModal(match)} />;
    });

    res = reactStringReplace(res, USER_MENTION_REGEX, (match, i, offset) => {
        if (!isValidUserName(match)) {
            return `@${match}`;
        }

        if (offset === 0) {
            return <ChatButton key={match + i} name={`@${match}`} onClick={() => showUserModal(match)} />;
        } else {
            return [" ", <ChatButton key={match + i} name={`@${match}`} onClick={() => showUserModal(match)} />];
        }
    });

    res = reactStringReplace(res, LOCAL_LINK_REGEX, (match, i) => (
        <Link key={match + i} to={`/${match}`}>{`${HOST}/${match}`}</Link>
    ));

    return reactStringReplace(res, LINK_REGEX, (match, i) => (
        <a key={match + i} target="_blank" href={match} rel="noreferrer">
            {match}
        </a>
    ));
}

export type Props = {
    message: MessageType;
    friends: Friend[];
    showBetModal(betId: number): void;
    showUserModal(userName: string): void;
};

export type State = {
    showUserPopover: boolean;
};

class Message extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showUserPopover: false,
        };
    }

    toggleUserPopover = () => {
        this.setState({
            showUserPopover: !this.state.showUserPopover,
        });
    };

    render() {
        const {message, friends, showBetModal, showUserModal} = this.props;
        const {user} = message;

        const messageClass = ClassNames(Style.message, {
            [Style.message_bot]: user.userType === "BOT",
        });

        const usernameClass = ClassNames(Style.username, {
            [Style.username_friend]: friends.findIndex((friend) => friend.user.address === user.address) !== -1,
        });

        const userName = <span className={usernameClass}>{user.username}:</span>;

        return (
            <div id={`messageEntry${message.timestamp}`} className={Style.messageEntry}>
                <div style={{minWidth: 0}}>
                    <div className={Style.user}>
                        <UserType userType={user.userType} />
                        {user.userType !== "BOT" ? (
                            <UserMenu user={user} messageId={message.id} button={userName} />
                        ) : (
                            <span>{userName}</span>
                        )}
                    </div>
                    {!message.deleted ? (
                        <span className={messageClass}>
                            {processMessage(message.message, showBetModal, showUserModal).map((x, i) =>
                                typeof x === "string" && x.length > 0 ? <Emoji key={i} text={x} /> : x
                            )}
                        </span>
                    ) : (
                        <span>[removed]</span>
                    )}
                </div>
                <span className={Style.time}>{dayjs(message.timestamp).format("HH:mm")}</span>
            </div>
        );
    }
}

export default Message;
