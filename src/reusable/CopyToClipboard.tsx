import * as React from "react";
import ReactCopyToClipboard from "react-copy-to-clipboard";

import IconButton from "./IconButton";
import Popover from "./Popover";

type Props = {
    content: string;
    message?: string;
};

type State = {
    showMessage: boolean;
};

class CopyToClipboard extends React.Component<Props, State> {
    ref: React.RefObject<HTMLElement>;

    constructor(props: Props) {
        super(props);

        this.state = {
            showMessage: false,
        };

        this.ref = React.createRef();
    }

    toggle = () => {
        this.setState({showMessage: false});
    };

    onCopy = () => {
        this.setState({showMessage: true});
        setTimeout(() => {
            this.setState({showMessage: false});
        }, 1000);
    };

    render() {
        const {showMessage} = this.state;
        const {content, message} = this.props;

        return (
            <span>
                <ReactCopyToClipboard text={content} onCopy={this.onCopy}>
                    <span ref={this.ref}>
                        {" "}
                        <IconButton
                            icon="share"
                            onClick={() => {
                                return;
                            }}
                        />{" "}
                    </span>
                </ReactCopyToClipboard>
                {this.ref.current && (
                    <Popover isOpen={showMessage} target={this.ref.current} toggle={this.toggle}>
                        <span className="text-success">{message ? message : "Copied!"}</span>
                    </Popover>
                )}
            </span>
        );
    }
}

export default CopyToClipboard;
