import * as React from 'react';
import {Container} from 'reactstrap';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';
import {authenticate, register} from '../platform/modules/account/asyncActions';
import {State} from "../rootReducer";
import {DispatchProp} from "../util/util";
import {RouteComponentProps} from "react-router";
import {toggleChat} from '../platform/modules/chat/actions';


const mapStateToProps = ({chat, account}: State) => {
    const show = chat.show;
    const jwt = account.jwt;

    return {
        showChat: show,
        authenticated: jwt !== null
    };
};

type OtherProps = {
    children: React.ReactNode
}

type ReduxProps = ReturnType<typeof mapStateToProps>;

type Props = RouteComponentProps<any> & ReduxProps & DispatchProp & OtherProps;

const Layout = ({children, dispatch, showChat, authenticated} : Props) => {
    const className = showChat ? 'chat-open' : '';

    return (
        <div id="app" className={className}>
            <Header
                showChat={showChat}
                authenticated={authenticated}
                toggleChat={() => dispatch(toggleChat(true))}
                authenticate={ () => { dispatch(authenticate()) }}/>
            {children}
            <Footer showChat={showChat} />
        </div>
    );
};

export default withRouter(connect(mapStateToProps)(Layout));
