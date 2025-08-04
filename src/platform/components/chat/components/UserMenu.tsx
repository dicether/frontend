import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {Button, Dropdown} from "../../../../reusable/index";
import {State} from "../../../../rootReducer";
import {Dispatch} from "../../../../util/util";
import {getUser} from "../../../modules/account/selectors";
import {User} from "../../../modules/account/types";
import {deleteMessage, mute} from "../../../modules/chat/asyncActions";
import {sendFriendRequest} from "../../../modules/friends/asyncActions";
import {showUserModal} from "../../../modules/modals/slice";

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
        dispatch,
    );

export interface OtherProps {
    user: User;
    messageId: number;
    button: React.ReactNode;
}

export type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    OtherProps &
    WithTranslation;

class UserMenu extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    private isInvitable = (address: string): boolean => {
        const {friends, receivedFriendRequests, sentFriendRequests, userAuth} = this.props;

        return (
            userAuth !== null &&
            address !== userAuth.address &&
            !friends.some((friend) => address === friend.user.address) &&
            !receivedFriendRequests.some((frq) => address === frq.from.address) &&
            !sentFriendRequests.some((frq) => address === frq.to.address)
        );
    };

    private sendInvite = () => {
        const {user, sendFriendRequest} = this.props;
        sendFriendRequest(user.address);
    };

    private mute = () => {
        const {user, mute} = this.props;
        mute(user.address);
    };

    private deleteMessage = () => {
        const {messageId, deleteMessage} = this.props;
        deleteMessage(messageId);
    };

    private showUser = () => {
        const {user, showUserModal} = this.props;
        showUserModal({user});
    };

    render() {
        const {button, user, userAuth, t} = this.props;
        const {address} = user;
        const isInvitable = this.isInvitable(address);
        const specialUser =
            userAuth && (userAuth.userType === "MOD" || userAuth.userType === "DEV" || userAuth.userType === "ADM");

        return (
            <Dropdown button={button}>
                <Button size="sm" variant="dropdown" onClick={this.showUser}>
                    {t("viewProfile")}
                </Button>
                {isInvitable && (
                    <Button size="sm" variant="dropdown" onClick={this.sendInvite}>
                        {t("sendFriendInvitation")}
                    </Button>
                )}
                {specialUser && (
                    <Button size="sm" variant="dropdown" onClick={this.mute}>
                        {t("muteUser")}
                    </Button>
                )}
                {specialUser && (
                    <Button size="sm" variant="dropdown" onClick={this.deleteMessage}>
                        {t("deleteMessage")}
                    </Button>
                )}
            </Dropdown>
        );
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(UserMenu));
