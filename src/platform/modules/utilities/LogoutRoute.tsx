import * as React from "react";
import {connect} from "react-redux";
import {Navigate} from "react-router-dom";

import {Dispatch} from "../../../util/util";
import {deauthenticate} from "../account/asyncActions";

const mapDispatchToProps = (dispatch: Dispatch) => ({
    deauthenticate: () => dispatch(deauthenticate()),
});

type Props = ReturnType<typeof mapDispatchToProps>;

class LogoutRoute extends React.Component<Props> {
    componentWillMount() {
        const {deauthenticate} = this.props;
        deauthenticate();
    }

    render() {
        return <Navigate replace to="/" />;
    }
}

export default connect(null, mapDispatchToProps)(LogoutRoute);
