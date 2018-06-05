import * as React from "react";

import {Button, Modal, ModalBody} from "../../../reusable";
import Register from "../../../platform/components/user/Register";


type State = {
    isOpen: boolean
};


class JoinNow extends React.Component<{}, State> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    onToggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    };

    render() {
        return (
            [
                <Button color="primary" size="lg" onClick={this.onToggle}>Join Now</Button>,
                <Modal isOpen={this.state.isOpen} toggle={this.onToggle}>
                    <ModalBody>
                        <Register/>
                    </ModalBody>
                </Modal>
            ]
        );
    }
}

export default JoinNow;
