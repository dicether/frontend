import * as React from "react";
import ReactCopyToClipboard from "react-copy-to-clipboard";

import IconButton from "./IconButton";
import Popover from "./Popover";

interface Props {
    content: string;
    message?: string;
}

interface State {
    showMessage: boolean;
}

class CopyToClipboard extends React.Component<Props, State> {
    ref: HTMLSpanElement | null = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            showMessage: false,
        };
    }

    toggle = () => {
        this.setState({showMessage: false});
    };

    onCopy = async () => {
        const {content} = this.props;
        try {
            await navigator.clipboard.writeText(content);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
        this.setState({showMessage: true});
        setTimeout(() => {
            this.setState({showMessage: false});
        }, 1000);
    };

    render() {
        const {showMessage} = this.state;
        const {message} = this.props;

        return (
            <span
                ref={(element) => {
                    this.ref = element;
                }}
            >
                {<IconButton icon="share" onClick={() => void this.onCopy()} />}
                {this.ref !== null && (
                    <Popover isOpen={showMessage} target={this.ref} toggle={this.toggle}>
                        <span className="text-success">{message ?? "Copied!"}</span>
                    </Popover>
                )}
            </span>
        );
    }
}

export default CopyToClipboard;
