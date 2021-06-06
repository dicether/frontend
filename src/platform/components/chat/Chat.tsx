import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";

import {State} from "../../../rootReducer";
import {getUser} from "../../modules/account/selectors";
import {addMessage, toggleChat} from "../../modules/chat/actions";
import {sendMessage} from "../../modules/chat/asyncActions";
import {showBetModal, showUserModal} from "../../modules/modals/actions";
import {showErrorMessage} from "../../modules/utilities/actions";
import Friends from "../friend/Friends";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import OpenButton from "./components/OpenButton";

import Style from "./Chat.scss";

const MAX_MESSAGE_LENGTH = 140;

const mapStateToProps = (state: State) => {
    const {show, messages, numUsers} = state.chat;
    const {friends} = state.friend;

    return {
        userAuth: getUser(state),
        show,
        messages,
        numUsers,
        friends,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            showErrorMessage,

            sendMessage,
            addMessage,
            toggleChat,
            showBetModal,
            showUserModal,
        },
        dispatch
    );

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export type ChatState = {
    showFriends: boolean;
    message: string;
};

class Chat extends React.Component<Props, ChatState> {
    constructor(props: Props) {
        super(props);
        this.state = {message: "", showFriends: false};
    }

    toggleFriends = (showFriends: boolean) => {
        this.setState({showFriends});
    };

    onMessageChange = (message: string) => {
        if (message.length > MAX_MESSAGE_LENGTH) {
            message = message.slice(0, MAX_MESSAGE_LENGTH);
        }
        this.setState({message});
    };

    onMessageSend = () => {
        const {showErrorMessage, sendMessage, userAuth} = this.props;
        const message = this.state.message;

        if (message.length === 0) {
            return;
        }

        if (!userAuth) {
            showErrorMessage("You need to log in to chat!");
            return;
        }

        sendMessage(message);
        this.setState({message: ""});
    };

    render() {
        const {toggleChat, show, messages, numUsers, friends, showBetModal, showUserModal} = this.props;
        const {showFriends} = this.state;

        return (
            <div id="chat-components">
                {show ? (
                    <div className={Style.chat}>
                        <Header
                            onClose={() => {
                                toggleChat(false);
                            }}
                            onToggleFriends={this.toggleFriends}
                        />
                        {showFriends ? (
                            <Friends />
                        ) : (
                            <MessageList
                                messages={messages}
                                friends={friends}
                                showBetModal={(betId) => showBetModal({betId})}
                                showUserModal={(userName) => showUserModal({userName})}
                            />
                        )}
                        <Footer
                            message={this.state.message}
                            numUsers={numUsers}
                            onMessageChange={this.onMessageChange}
                            onMessageSend={this.onMessageSend}
                        />
                    </div>
                ) : (
                    <OpenButton
                        onOpen={() => {
                            toggleChat(true);
                        }}
                    />
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
