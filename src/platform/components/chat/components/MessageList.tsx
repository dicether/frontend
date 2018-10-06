import * as React from "react";

import Message from "./Message";

const Style = require("./MessageList.scss");

import {Message as MessageType} from "../../../modules/chat/types";
import {Friend} from "../../../modules/friends/types";

export type Props = {
    messages: MessageType[];
    friends: Friend[];
};

class MessageList extends React.PureComponent<Props> {
    shouldScrollBottom: boolean;
    messageList: any;

    constructor(props: Props) {
        super(props);

        this.shouldScrollBottom = true;
        this.messageList = null;
    }

    scrollToBottom() {
        window.requestAnimationFrame(() => {
            if (this.messageList !== null) {
                const node = this.messageList;
                node.scrollTop = node.scrollHeight;
            }
        });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentWillUpdate() {
        if (this.messageList !== null) {
            const node = this.messageList;
            this.shouldScrollBottom = Math.abs(node.scrollTop + node.offsetHeight - node.scrollHeight) < 2;
        }
    }

    componentDidUpdate() {
        if (this.shouldScrollBottom) {
            this.scrollToBottom();
        }
    }

    render() {
        const {messages, friends} = this.props;
        return (
            <div ref={ref => (this.messageList = ref)} className={Style.messageList}>
                {messages.slice().map(message => (
                    <Message key={message.id} message={message} friends={friends} />
                ))}
            </div>
        );
    }
}

export default MessageList;
