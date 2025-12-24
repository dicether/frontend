import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import * as React from "react";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import {Store} from "redux";
import {WagmiProvider} from "wagmi";

import App from "./app/App";
import withTracker from "./app/withTracker";
import wagmiConfig from "./config/wagmiConfig";
import {State} from "./rootReducer";

export interface Props {
    store: Store<State>;
}

const TrackedApp = withTracker(App);

const queryClient = new QueryClient();

export default class Root extends React.Component<Props> {
    render() {
        return (
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <Provider store={this.props.store}>
                        <Router>
                            <TrackedApp />
                        </Router>
                    </Provider>
                </QueryClientProvider>
            </WagmiProvider>
        );
    }
}
