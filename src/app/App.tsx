import * as React from "react";
import Countdown from "react-countdown-now";
import DocumentTitle from "react-document-title";
import {connect} from "react-redux";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";

import {RouteComponentProps} from "react-router";
import {bindActionCreators} from "redux";
import {WEB3_POLL_INTERVAL} from "../config/config";
import Layout from "../layout/Layout";
import Account from "../pages/account/Account";
import Faq from "../pages/faq/Faq";
import Game from "../pages/games/Game";
import GameSession from "../pages/gameSession/GameSession";
import HallOfFame from "../pages/hallOfFame/HallOfFame";
import Index from "../pages/index/Index";
import Chat from "../platform/components/chat/Chat";
import Modals from "../platform/components/modals/Modals";
import StateLoader from "../platform/components/state/StateLoader";
import {initUser, loadDefaultData} from "../platform/modules/account/asyncActions";
import {getUser} from "../platform/modules/account/selectors";
import LogoutRoute from "../platform/modules/utilities/LogoutRoute";
import {fetchAllWeb3} from "../platform/modules/web3/asyncActions";
import {init as initSockets, unInit as unInitSockets} from "../platform/sockets";
import {Button} from "../reusable";
import {State as RootState} from "../rootReducer";
import TermsOfUse from "../termsOfUse/TermsOfUse";
import {Dispatch} from "../util/util";
import AuthenticatedRoute from "./AuthenticatedRoute";
import BeforeUnload from "./BeforeUnload";
import Notification from "./Notification";
import PathNotFound from "./PathNotFound";

const Style = require("./App.scss");

export const mapStateToProps = (state: RootState) => {
    const {account, app, web3, games} = state;
    const {gameState} = games;
    const {notification, nightMode} = app;
    const jwt = account.jwt;

    return {
        jwt,
        userAuth: getUser(state),
        defaultAccount: web3.account,
        notification,
        nightMode,
        gameState,
        web3: web3.web3,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators({fetchAllWeb3}, dispatch),
    initSockets: () => initSockets(dispatch),
    unInitSockets: () => unInitSockets(dispatch),
    initUser: (address: string) => initUser(dispatch, address),
    loadDefaultData: () => loadDefaultData(dispatch),
});

export type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    RouteComponentProps<any>;

export type State = {
    web3Timer: number | null;
};

type DynamicIndexProps = {
    loggedIn: boolean;
};

const DynamicIndex = ({loggedIn, ...rest}: DynamicIndexProps) =>
    loggedIn ? <Redirect {...rest} to="/games/dice" /> : <Index {...rest} />;

const TimeTillLive = ({days, hours, minutes, seconds, completed}: any) => (
    <div className={Style.center}>
        <span className={Style.timeout}>
            Or not? Update in {Number.parseInt(hours, 10) + 24 * days}:{minutes}:{seconds}
        </span>
    </div>
);

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {web3Timer: null};
    }

    componentWillMount() {
        const {jwt, fetchAllWeb3, initUser, initSockets, loadDefaultData} = this.props;

        loadDefaultData();
        initSockets();

        if (jwt !== null) {
            initUser(jwt);
        }

        fetchAllWeb3();
        const timer = window.setInterval(() => fetchAllWeb3(), WEB3_POLL_INTERVAL);
        this.setState({web3Timer: timer});

        this.setTheme(this.props.nightMode);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.nightMode !== this.props.nightMode) {
            this.setTheme(nextProps.nightMode);
        }
    }

    componentWillUnmount() {
        const {unInitSockets} = this.props;
        unInitSockets();

        const {web3Timer} = this.state;
        if (web3Timer !== null) {
            clearInterval(web3Timer);
        }
    }

    private setTheme = (nightMode: boolean) => {
        if (nightMode) {
            document.body.classList.add("night");
        } else {
            document.body.classList.remove("night");
        }
    }

    render() {
        const date = new Date("01 Apr 2019 18:00:00 GMT");
        const dateInMilliseconds = date.getTime();

        return (
            <DocumentTitle title="Dicether">
                <div>
                    <span className={Style.closed}>Closed</span>
                    <Countdown renderer={(props: any) => <TimeTillLive {...props} />} date={dateInMilliseconds} />
                </div>
            </DocumentTitle>
        );
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);
