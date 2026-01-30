import * as React from "react";
import {useEffect} from "react";
import {Helmet} from "react-helmet";
import {useSelector} from "react-redux";
import {Navigate, Route, Routes} from "react-router-dom";
import {useConnection} from "wagmi";

import BeforeUnload from "./BeforeUnload";
import Notification from "./Notification";
import PathNotFound from "./PathNotFound";
import RequireAuth from "./RequireAuth";
import useConstructor from "../hooks/useConstructor";
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
import {init as initSockets, unInit as unInitSockets} from "../platform/sockets";
import {State as RootState} from "../rootReducer";
import TermsOfUse from "../termsOfUse/TermsOfUse";
import {useDispatch} from "../util/util";

const jwtSelector = (state: RootState) => state.account.jwt;
const userAuthSelector = (state: RootState) => getUser(state);
const nightModeSelector = (state: RootState) => state.app.nightMode;
const notificationSelector = (state: RootState) => state.app.notification;
const gameStateSelector = (state: RootState) => state.games.gameState;

const App = () => {
    const dispatch = useDispatch();

    const jwt = useSelector(jwtSelector);
    const userAuth = useSelector(userAuthSelector);
    const nightMode = useSelector(nightModeSelector);
    const notification = useSelector(notificationSelector);
    const gameState = useSelector(gameStateSelector);

    useConstructor(() => {
        console.log("Initializing user...");
        if (jwt !== null) {
            initUser(dispatch, jwt);
        }
    });

    useEffect(() => {
        loadDefaultData(dispatch);
        initSockets(dispatch);

        setTheme(nightMode);
    }, []);

    useEffect(() => {
        return () => {
            unInitSockets(dispatch);
        };
    }, []);

    useEffect(() => {
        setTheme(nightMode);
    }, [nightMode]);

    const {address} = useConnection();

    const setTheme = (nightMode: boolean) => {
        if (nightMode) {
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-bs-theme", "light");
        }
    };

    const logout = userAuth !== null && userAuth.address !== address;
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
                {logout && <Navigate replace to="/logout" />}
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/hallOfFame/*" element={<HallOfFame />} />
                    <Route path="/termsOfUse" element={<TermsOfUse />} />
                    <Route path="/logout" element={<LogoutRoute />} />
                    <Route path="/games/*" element={<Game />} />
                    <Route
                        path="/account/*"
                        element={
                            <RequireAuth authenticated={userAuth !== null}>
                                <Account />
                            </RequireAuth>
                        }
                    />
                    <Route path="/gameSession/:gameId" element={<GameSession />} />
                    <Route path="*" element={<PathNotFound insideContainer />} />
                </Routes>
                <Chat />
                {/*<TermsOfUseModal/>*/}
                <Modals />
                <BeforeUnload gameState={gameState} />
                <Notification notification={notification} />
                <StateLoader />
            </Layout>
        </>
    );
};

export default App;
