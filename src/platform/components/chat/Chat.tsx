import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";

import {State} from "../../../rootReducer";
import {getUser} from "../../modules/account/selectors";
import {addMessage, toggleChat} from "../../modules/chat/actions";
import {sendMessage} from "../../modules/chat/asyncActions";
import {showBetModal, showUserModal} from "../../modules/modals/slice";
import {showErrorMessage} from "../../modules/utilities/actions";
import Friends from "../friend/Friends";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import OpenButton from "./components/OpenButton";

import * as Style from "./Chat.scss";

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
        dispatch,
    );

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export interface ChatState {
    showFriends: boolean;
}

class Chat extends React.Component<Props, ChatState> {
    constructor(props: Props) {
        super(props);
        this.state = {showFriends: false};
    }

    toggleFriends = (showFriends: boolean) => {
        this.setState({showFriends});
    };

    onMessageSend = (message: string) => {
        const {showErrorMessage, sendMessage, userAuth} = this.props;

        if (message.length === 0) {
            return;
        }

        if (!userAuth) {
            showErrorMessage("You need to log in to chat!");
            return;
        }

        sendMessage(message);
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
                            maxMessageLength={MAX_MESSAGE_LENGTH}
                            numUsers={numUsers}
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
