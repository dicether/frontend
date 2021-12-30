import * as React from "react";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";

import {Store} from "redux";
import App from "./app/App";
import withTracker from "./app/withTracker";
import {State} from "./rootReducer";

export type Props = {
    store: Store<State>;
};

const TrackedApp = withTracker(App);

export default class Root extends React.Component<Props> {
    render() {
        return (
            <Provider store={this.props.store}>
                <Router>
                    <TrackedApp />
                </Router>
            </Provider>
        );
    }
}
