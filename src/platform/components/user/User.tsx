import * as React from 'react';
import {User as UserType} from "../../modules/account/types";
import UserInfo from "./UserInfo";
import {Button, DataLoader, Modal, ModalBody} from "../../../reusable";

const Style = require('./User.scss');

export type Props = {
    userName?: string
    user?: UserType
    button?: React.ReactElement<any>
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
        const {user, userName, button} = this.props;
        const name = user ? user.username : userName;

        return [
            button ?
                React.cloneElement(
                    button,
                    {onClick: this.onToggleModal}
                )
                :
                <button className={Style.name} onClick={this.onToggleModal}>{name}</button>,
            <Modal isOpen={this.state.showModal} toggle={this.onToggleModal}>
                {!user ? <DataLoader
                    url={`/user/name/${userName}`}
                    success={(user) => <UserInfo user={user}/>}
                />
                    :
                <UserInfo user={user}/>
                }
            </Modal>
        ];
    }
}

export default User;
