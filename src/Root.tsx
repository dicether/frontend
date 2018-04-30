import * as React from 'react'
import {Provider}  from 'react-redux'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import App from './app/App'
import withTracker from './app/withTracker';
import {Store} from "redux";
import {State} from "./rootReducer";


export type Props = {
    store: Store<State>;
}


export default class Root extends React.Component<Props> {
    render() {
        return (
            <Provider store={this.props.store}>
                    <Router>
                        <Route component={withTracker(App)}/>
                    </Router>
            </Provider>
        );
    }
}
