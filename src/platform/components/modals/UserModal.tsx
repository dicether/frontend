import * as React from "react";
import {connect} from "react-redux";

import {Modal} from "../../../reusable";
import {State} from "../../../rootReducer";
import {Dispatch} from "../../../util/util";
import {hideUserModal} from "../../modules/modals/slice";
import User from "../user/User";

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
