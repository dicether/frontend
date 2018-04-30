import * as React from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {deauthenticate} from '../account/asyncActions'
import {DispatchProp} from "../../../util/util";


type Props = DispatchProp

class LogoutRoute extends React.Component<Props> {
    componentWillMount() {
        this.props.dispatch(deauthenticate());
    }

    render() {
        return <Redirect to="/"/>
    }

}

export default connect()(LogoutRoute)
