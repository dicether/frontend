import * as React from 'react';
import {User as UserType} from "../../modules/account/types";
import UserInfo from "./UserInfo";
import {Button, Modal, ModalBody} from "../../../reusable";

const Style = require('./User.scss');

export type Props = {
    user: UserType
    userButton?: React.ReactNode
}

export type State = {
    showModal;
}


class  User extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    onToggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    };

    render() {
        const {user, userButton} = this.props;

        return (
            <span>
                <span className={Style.name} onClick={this.onToggleModal}>{
                    userButton ? userButton : user.username
                }</span>

                <Modal isOpen={this.state.showModal} toggle={this.onToggleModal}>
                    <UserInfo user={user}/>
                </Modal>
            </span>
        )
    }
}

export default User;
