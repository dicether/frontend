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
                <Button key={1} color="primary" size="lg" onClick={this.onToggle}>Join Now</Button>,
                <Modal key={2} isOpen={this.state.isOpen} toggle={this.onToggle}>
                        <Register/>
                </Modal>
            ]
        );
    }
}

export default JoinNow;
