import * as React from "react";

import {SESSION_TIMEOUT} from "../../../config/config";
import {Button, Modal} from "../../../reusable";

export type Props = {
    conflictEnd(): void;
};

export type State = {
    showModal: boolean;
};

class ConflictEnd extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showModal: false,
        };
    }

    onToggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    };

    onConflictEnd = () => {
        this.props.conflictEnd();
        this.onToggleModal();
    };

    render() {
        return (
            <span>
                <Button size="sm" color="primary" onClick={this.onToggleModal}>
                    Conflict End
                </Button>
                <Modal isOpen={this.state.showModal} toggle={this.onToggleModal}>
                    <p>
                        It should be almost never needed to do this. It is only necessary if the server stops
                        responding. This will push your current game state to the smart contract. If the server doesn't
                        publish any newer game state within the next {SESSION_TIMEOUT} you can force the game session
                        termination.
                    </p>
                    <div>
                        <Button color="danger" onClick={this.onConflictEnd}>
                            Conflict End
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

export default ConflictEnd;
