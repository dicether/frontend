import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";

import {authenticate} from "../platform/modules/account/asyncActions";
import {toggleChat} from "../platform/modules/chat/actions";
import {showRegisterModal} from "../platform/modules/modals/slice";
import {toggleTheme} from "../platform/modules/utilities/actions";
import {State} from "../rootReducer";
import Footer from "./Footer";
import Header from "./Header";

const mapStateToProps = ({chat, account, app}: State) => {
    const show = chat.show;
    const jwt = account.jwt;

    return {
        showChat: show,
        authenticated: jwt !== null,
        nightMode: app.nightMode,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            toggleChat,
            authenticate,
            toggleTheme,
            showRegisterModal,
        },
        dispatch,
    );

interface OtherProps {
    children: React.ReactNode;
}

type ReduxProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

type Props = ReduxProps & OtherProps;

const Layout = ({
    children,
    showChat,
    authenticated,
    nightMode,
    toggleChat,
    authenticate,
    toggleTheme,
    showRegisterModal,
}: Props) => {
    const className = showChat ? "chat-open" : "";

    return (
        <div id="app" className={className}>
            <Header
                showChat={showChat}
                authenticated={authenticated}
                nightMode={nightMode}
                toggleChat={() => toggleChat(true)}
                authenticate={authenticate}
                toggleTheme={toggleTheme}
                showRegisterModal={showRegisterModal}
            />
            {children}
            <Footer showChat={showChat} />
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
