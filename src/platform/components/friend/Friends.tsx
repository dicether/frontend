import * as React from "react";
import {connect} from "react-redux";

import {bindActionCreators} from "redux";
import {State} from "../../../rootReducer";
import {Dispatch} from "../../../util/util";
import {acceptFriendRequest, cancelFriendRequest, declineFriendRequest} from "../../modules/friends/asyncActions";
import FriendList from "./FriendList";
import FriendRequests from "./FriendRequests";

import * as Style from "./Friends.scss";

const mapStateToProps = ({friend}: State) => {
    const {friends, receivedFriendRequests, sentFriendRequests} = friend;

    return {
        friends,
        receivedFriendRequests,
        sentFriendRequests,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            acceptFriendRequest,
            declineFriendRequest,
            cancelFriendRequest,
        },
        dispatch,
    );

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class Friends extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {
            acceptFriendRequest,
            declineFriendRequest,
            cancelFriendRequest,
            friends,
            receivedFriendRequests,
            sentFriendRequests,
        } = this.props;

        return (
            <div className={Style.friends}>
                <FriendList friends={friends} />
                <FriendRequests
                    sentFriendRequests={sentFriendRequests}
                    receivedFriendRequests={receivedFriendRequests}
                    onAcceptFriendRequest={(address) => {
                        acceptFriendRequest(address);
                    }}
                    onDeclineFriendRequest={(address) => {
                        declineFriendRequest(address);
                    }}
                    onCancelFriendRequest={(address) => {
                        cancelFriendRequest(address);
                    }}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
