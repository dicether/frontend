import * as React from "react";

import {Modal} from "../../../reusable";
import User from "../user/User";
import {connect} from "react-redux";
import {State} from "../../../rootReducer";
import {Dispatch} from "../../../util/util";
import {hideUserModal} from "../../modules/modals/slice";

const mapStateToProps = ({modal}: State) => {
    const {userModal} = modal;
    const {showUserModal: show, user, userName} = userModal;
    return {
        show,
        user,
        userName,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    hide: () => dispatch(hideUserModal()),
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const UserModal = ({show, hide, user, userName}: Props) => (
    <Modal toggle={hide} isOpen={show}>
        {show && <User userName={userName} user={user} />}
    </Modal>
);

export default connect(mapStateToProps, mapDispatchToProps)(UserModal);
