import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {changeFirstVisited} from "../platform/modules/account/asyncActions";
import {Button, Modal} from "../reusable/index";

import {BUGS_URL} from "../config/config";
import {State} from "../rootReducer";
import {Dispatch} from "../util/util";

const mapStateToProps = ({account}: State) => {
    const {firstVisited} = account;

    return {
        firstVisited,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            changeFirstVisited,
        },
        dispatch
    );

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class TermsOfUseModal extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    onClose = () => {
        const {changeFirstVisited} = this.props;
        changeFirstVisited(false);
    }

    render() {
        const {firstVisited} = this.props;

        return (
            <Modal isOpen={firstVisited} toggle={this.onClose}>
                <h3 className="text-center">Welcome to Dicether</h3>
                <p>
                    This is the beta version of dicether.com. You can try all features using the ethereum mainet. If you
                    find any bugs, please report it to <a href={`mailto:${BUGS_URL}`}>{BUGS_URL}</a>.<br />
                    Play responsibly and do not bet what you can not afford to lose. Do not play if you are under 18. Do
                    not play if doing so is illegal in your jurisdiction!
                </p>
                <Button color="primary" onClick={this.onClose}>
                    OK
                </Button>
            </Modal>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TermsOfUseModal);
