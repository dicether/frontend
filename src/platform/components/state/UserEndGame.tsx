import * as React from "react";

import {Button, Modal} from "../../../reusable";

export type Props = {
    userEndGame(): void;
};

export type State = {
    showModal: boolean;
};

class UserEndGame extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showModal: false,
        };
    }

    onToggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    };

    onUserEndGame = () => {
        this.props.userEndGame();
        this.onToggleModal();
    };

    render() {
        return (
            <span>
                <Button size="sm" color="primary" onClick={this.onToggleModal}>
                    Send userEndGame transaction
                </Button>
                <Modal isOpen={this.state.showModal} toggle={this.onToggleModal}>
                    <p>
                        It should be almost never needed to do this. Normally the server sends the end transaction. But
                        you can send the transaction, too.
                    </p>
                    <div>
                        <Button color="danger" onClick={this.onUserEndGame}>
                            Send userEndGame transaction
                        </Button>{" "}
                        <Button color="secondary" onClick={this.onToggleModal}>
                            Cancel
                        </Button>
                    </div>
                </Modal>
            </span>
        );
    }
}

export default UserEndGame;
