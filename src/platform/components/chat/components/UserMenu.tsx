import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {Button, Dropdown} from "../../../../reusable/index";
import {State} from "../../../../rootReducer";
import {Dispatch} from "../../../../util/util";
import {getUser} from "../../../modules/account/selectors";
import {User} from "../../../modules/account/types";
import {deleteMessage, mute} from "../../../modules/chat/asyncActions";
import {sendFriendRequest} from "../../../modules/friends/asyncActions";
import {showUserModal} from "../../../modules/modals/actions";

export const mapStateToProps = (state: State) => {
    const {web3, friend} = state;
    const {friends, receivedFriendRequests, sentFriendRequests} = friend;

    return {
        friends,
        receivedFriendRequests,
        sentFriendRequests,
        userAuth: getUser(state),
        defaultAccount: web3.account,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            sendFriendRequest,
            deleteMessage,
            mute,
            showUserModal,
        },
        dispatch
    );

export type OtherProps = {
    user: User;
    messageId: number;
    button: React.ReactNode;
};

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OtherProps;

class UserMenu extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    isInvitable = (address: string): boolean => {
        const {friends, receivedFriendRequests, sentFriendRequests, userAuth} = this.props;

        return (
            userAuth !== null &&
            address !== userAuth.address &&
            !friends.some(friend => address === friend.user.address) &&
            !receivedFriendRequests.some(frq => address === frq.from.address) &&
            !sentFriendRequests.some(frq => address === frq.to.address)
        );
    }

    sendInvite = (address: string) => {
        const sendFriendRequest = this.props.sendFriendRequest;
        sendFriendRequest(address);
    }

    mute = (address: string) => {
        const mute = this.props.mute;
        mute(address);
    }

    deleteMessage = (messageId: number) => {
        const deleteMessage = this.props.deleteMessage;
        deleteMessage(messageId);
    }

    showUser = () => {
        const {user, showUserModal} = this.props;
        showUserModal({user});
    }

    render() {
        const {button, user, userAuth, messageId} = this.props;
        const {address} = user;
        const isInvitable = this.isInvitable(address);
        const specialUser =
            userAuth && (userAuth.userType === "MOD" || userAuth.userType === "DEV" || userAuth.userType === "ADM");

        return (
            <Dropdown button={button}>
                <Button size="sm" variant="dropdown" onClick={this.showUser}>
                    View Profile
                </Button>
                {isInvitable && (
                    <Button size="sm" variant="dropdown" onClick={() => this.sendInvite(address)}>
                        Send Friend Invitation
                    </Button>
                )}
                {specialUser && (
                    <Button size="sm" variant="dropdown" onClick={() => this.mute(address)}>
                        Mute User
                    </Button>
                )}
                {specialUser && (
                    <Button size="sm" variant="dropdown" onClick={() => this.deleteMessage(messageId)}>
                        Delete Message
                    </Button>
                )}
            </Dropdown>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserMenu);
