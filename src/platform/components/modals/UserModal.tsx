import * as React from "react";
import {connectModal, InjectedProps} from "redux-modal";

import {Modal} from "../../../reusable";
import {User as UserType} from "../../modules/account/types";
import User from "../user/User";

type Props = InjectedProps & {user?: UserType; userName?: string};

const UserModal = ({show, handleHide, user, userName}: Props) => (
    <Modal toggle={handleHide} isOpen={show}>
        <User userName={userName} user={user} />
    </Modal>
);

export default connectModal({name: "user"})(UserModal);
