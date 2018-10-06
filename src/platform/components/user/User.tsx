import * as React from "react";
import {DataLoader, Modal} from "../../../reusable";
import {User as UserType} from "../../modules/account/types";
import UserInfo from "./UserInfo";

const Style = require("./User.scss");

export type Props = {
    userName?: string;
    user?: UserType;
    button?: React.ReactElement<any>;
    onToggle?(open: boolean);
};

export type State = {
    showModal;
};

class User extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    onToggleModal = () => {
        const {onToggle} = this.props;
        if (onToggle) {
            onToggle(!this.state.showModal);
        }
        this.setState({showModal: !this.state.showModal});
    }

    render() {
        const {user, userName, button} = this.props;
        const name = user ? user.username : userName;

        return (
            <React.Fragment>
                {button ? (
                    React.cloneElement(button, {onClick: this.onToggleModal, key: "1"})
                ) : (
                    <button key="2" className={Style.name} onClick={this.onToggleModal}>
                        {name}
                    </button>
                )}
                <Modal key="3" isOpen={this.state.showModal} toggle={this.onToggleModal}>
                    {!user ? (
                        <DataLoader url={`/user/name/${userName}`} success={user => <UserInfo user={user} />} />
                    ) : (
                        <UserInfo user={user} />
                    )}
                </Modal>
            </React.Fragment>
        );
    }
}

export default User;
