import * as React from "react";

import Message from "./Message";
import {Message as MessageType} from "../../../modules/chat/types";
import {Friend} from "../../../modules/friends/types";

import * as Style from "./MessageList.scss";

export interface Props {
    messages: MessageType[];
    friends: Friend[];
    showBetModal(betId: number): void;
    showUserModal(userName: string): void;
}

class MessageList extends React.PureComponent<Props> {
    shouldScrollBottom: boolean;
    messageList: any;

    constructor(props: Props) {
        super(props);

        this.shouldScrollBottom = true;
        this.messageList = null;
    }

    scrollToBottom(smooth: boolean) {
        if (this.messageList !== null) {
            this.messageList.scrollIntoView({behavior: smooth ? "instant" : "instant"});
        }
    }

    componentDidMount() {
        this.scrollToBottom(false);
    }

    componentDidUpdate() {
        this.scrollToBottom(true);
    }

    render() {
        const {messages, friends, showBetModal, showUserModal} = this.props;
        return (
            <div className={Style.messageList}>
                {messages.slice().map((message) => (
                    <Message
                        key={message.id}
                        message={message}
                        friends={friends}
                        showBetModal={showBetModal}
                        showUserModal={showUserModal}
                    />
                ))}
                <div ref={(ref) => (this.messageList = ref)} data-explanation="This is where we scroll to" />
            </div>
        );
    }
}

export default MessageList;
