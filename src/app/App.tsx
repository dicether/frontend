import * as React from "react";
import DocumentTitle from "react-document-title";
import {connect} from "react-redux";
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from "react-router-dom";

import {bindActionCreators} from "redux";
import {ACCOUNT_BALANCE_POLL_INTERVAL} from "../config/config";
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
import {
    fetchAccountBalance,
    fetchAllWeb3,
    registerAccountChainIdListener,
    unregisterAccounChainIdListener,
} from "../platform/modules/web3/asyncActions";
import {init as initSockets, unInit as unInitSockets} from "../platform/sockets";
import {State as RootState} from "../rootReducer";
import TermsOfUse from "../termsOfUse/TermsOfUse";
import {Dispatch} from "../util/util";
import AuthenticatedRoute from "./AuthenticatedRoute";
import BeforeUnload from "./BeforeUnload";
import Notification from "./Notification";
import PathNotFound from "./PathNotFound";
import {Helmet} from "react-helmet";

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
    ...bindActionCreators({fetchAllWeb3, fetchAccountBalance, registerAccountChainIdListener}, dispatch),
    initSockets: () => initSockets(dispatch),
    unInitSockets: () => unInitSockets(dispatch),
    initUser: (address: string) => initUser(dispatch, address),
    loadDefaultData: () => loadDefaultData(dispatch),
});

export type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    RouteComponentProps<any>;

class App extends React.Component<Props> {
    private accountBalanceTimer: number | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {web3Timer: null};

        const {jwt, initUser} = this.props;

        if (jwt !== null) {
            initUser(jwt);
        }
    }

    componentDidMount() {
        const {fetchAllWeb3, fetchAccountBalance, initSockets, loadDefaultData, registerAccountChainIdListener} =
            this.props;

        loadDefaultData();
        initSockets();

        fetchAllWeb3();
        this.accountBalanceTimer = window.setInterval(() => fetchAccountBalance(), ACCOUNT_BALANCE_POLL_INTERVAL);
        registerAccountChainIdListener();

        this.setTheme(this.props.nightMode);
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.nightMode !== this.props.nightMode) {
            this.setTheme(this.props.nightMode);
        }

        this.props.fetchAllWeb3();
    }

    componentWillUnmount() {
        const {unInitSockets} = this.props;
        unInitSockets();

        unregisterAccounChainIdListener();
        if (this.accountBalanceTimer !== null) {
            clearInterval(this.accountBalanceTimer);
        }
    }

    private setTheme = (nightMode: boolean) => {
        if (nightMode) {
            document.body.classList.add("night");
        } else {
            document.body.classList.remove("night");
        }
    };

    render() {
        const {userAuth, notification, defaultAccount, gameState} = this.props;

        const logout = userAuth !== null && userAuth.address !== defaultAccount && defaultAccount !== null;

        return (
            <>
                <Helmet>
                    <title>Dicether</title>
                    <meta
                        name="description"
                        content="Dicether is an Ethereum dice game. It uses a smart contract based state channel implementation to provide a fast, secure and provably fair gambling experience."
                    />
                </Helmet>
                <Layout>
                    {logout && <Redirect to="/logout" />}
                    <Switch>
                        <Route exact path="/" component={Index} />
                        <Route exact path="/faq" component={Faq} />
                        <Route path="/hallOfFame" component={HallOfFame} />
                        <Route exact path="/termsOfUse" component={TermsOfUse} />
                        <Route exact path="/logout" component={LogoutRoute} />
                        <Route exact path="/games/(dice|chooseFrom12|flipACoin|keno|wheel|plinko)" component={Game} />
                        <AuthenticatedRoute authenticated={userAuth !== null} path="/account" component={Account} />
                        <Route exact path="/gameSession/:gameId(\d+)" component={GameSession} />
                        <Route component={PathNotFound} />
                    </Switch>
                    <Chat />
                    {/*<TermsOfUseModal/>*/}
                    <Modals />
                    <BeforeUnload gameState={gameState} />
                    <Notification notification={notification} />
                    <StateLoader />
                </Layout>
            </>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
