import * as React from 'react';
import {Container} from 'reactstrap';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';
import {authenticate, register} from '../platform/modules/account/asyncActions';
import {State} from "../rootReducer";
import {RouteComponentProps} from "react-router";
import {toggleChat} from '../platform/modules/chat/actions';
import {toggleTheme} from "../platform/modules/utilities/actions";
import {bindActionCreators, Dispatch} from "redux";


const mapStateToProps = ({chat, account, app}: State) => {
    const show = chat.show;
    const jwt = account.jwt;

    return {
        showChat: show,
        authenticated: jwt !== null,
        nightMode: app.nightMode
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    toggleChat,
    authenticate,
    toggleTheme
}, dispatch);

type OtherProps = {
    children: React.ReactNode
}

type ReduxProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

type Props = RouteComponentProps<any> & ReduxProps & OtherProps;

const Layout = ({children, showChat, authenticated, nightMode, toggleChat, authenticate, toggleTheme} : Props) => {
    const className = showChat ? 'chat-open' : '';

    return (
        <div id="app" className={className}>
            <Header
                showChat={showChat}
                authenticated={authenticated}
                nightMode={nightMode}
                toggleChat={() => toggleChat(true)}
                authenticate={authenticate}
                toggleTheme={toggleTheme}
            />
            {children}
            <Footer showChat={showChat} />
        </div>
    );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
