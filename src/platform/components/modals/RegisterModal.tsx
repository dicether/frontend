import * as React from "react";

import {Modal} from "../../../reusable";
import Register from "../user/Register";
import {connect} from "react-redux";
import {State} from "../../../rootReducer";
import {Dispatch} from "../../../util/util";
import {hideRegisterModal} from "../../modules/modals/slice";

const mapStateToProps = ({modal}: State) => {
    const {showRegisterModal: show} = modal;

    return {
        show,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    hide: () => dispatch(hideRegisterModal()),
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const RegisterModal = ({show, hide}: Props) => (
    <Modal toggle={hide} isOpen={show}>
        <Register />
    </Modal>
);

export default connect(mapStateToProps, mapDispatchToProps)(RegisterModal);
