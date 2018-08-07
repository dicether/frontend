import * as React from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {deauthenticate} from '../account/asyncActions'
import {Dispatch} from "../../../util/util";
import {Campaign} from "../../../pages/account/components/affiliate/types";


const mapDispatchToProps = (dispatch: Dispatch) => ({
    deauthenticate: () => dispatch(deauthenticate()),
});

type State = {
    campaigns: Campaign[],
    balance: number
}

type Props = ReturnType<typeof mapDispatchToProps>;

class LogoutRoute extends React.Component<Props> {
    componentWillMount() {
        const {deauthenticate} = this.props;
        deauthenticate();
    }

    render() {
        return <Redirect to="/"/>
    }

}

export default connect(null, mapDispatchToProps)(LogoutRoute)
