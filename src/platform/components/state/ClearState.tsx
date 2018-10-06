import * as React from "react";

import {Button, Modal} from "../../../reusable";

export type Props = {
    clearState();
};

export type State = {
    showModal: boolean;
};

class ClearState extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showModal: false,
        };
    }

    onToggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    }

    onClearState = () => {
        this.props.clearState();
        this.onToggleModal();
    }

    render() {
        return (
            <span>
                <Button size="sm" color="primary" onClick={this.onToggleModal}>
                    Clear State
                </Button>
                <Modal isOpen={this.state.showModal} toggle={this.onToggleModal}>
                    <p>
                        Do you really want to delete you local game state! This should be only done if you know what you
                        are doing!
                    </p>
                    <div>
                        <Button color="danger" onClick={this.onClearState}>
                            Clear State
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

export default ClearState;
