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
    const className = showChat;

    return (
        <div id="app" className="chat-open">
            <Header
                showChat={showChat}
                authenticated={authenticated}
                register={(username: string) => dispatch(register(username))}
                toggleChat={() => dispatch(toggleChat(true))}
                authenticate={ () => { dispatch(authenticate()) }}/>
            <Container>
                {children}
            </Container>
            <Footer showChat={showChat} />
        </div>
    );
};

export default withRouter(connect(mapStateToProps)(Layout));
