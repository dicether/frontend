import * as React from 'react';
import {Container, Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink} from 'reactstrap';
import {NavLink as RRNavLink} from 'react-router-dom';
import ClassName from 'classnames';

import Register from '../platform/components/user/Register';
import {Popover} from '../reusable/index';
import {CONTRACT_URL} from "../config/config";

const Style = require('./Header.scss');

const logo = require ('assets/images/logoTop.svg');


class RegisterNavItem extends React.Component<{}, {showRegister: boolean}> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showRegister: false
        }
    }

    toggleRegister = () => {
        this.setState({
            showRegister: !this.state.showRegister
        });
    };

    render() {
        const {showRegister} = this.state;
        return(
            <div>
                <NavLink id="register" href="#" onClick={this.toggleRegister}>
                    Register
                </NavLink>
                <Popover isOpen={showRegister} toggle={this.toggleRegister} target="register">
                    <Register/>
                </Popover>
            </div>
        )
    }
}


type Props = {
    authenticated: boolean,
    showChat: boolean,
    toggleChat(show: boolean): void,
    authenticate(): void,
}

type State = {
    isOpen: boolean,
    showRegister: boolean
}

class Header extends React.Component<Props, State> {
    constructor(props : Props) {
        super(props);
        this.state = {
            isOpen: false,
            showRegister: false
        }
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    onToggleChat = () => {
        const {showChat, toggleChat} = this.props;
        toggleChat(!showChat);
    };

    render () {
        const {authenticated, showChat} = this.props;
        const {isOpen} = this.state;

        const className = ClassName({
            'container-chat-open': showChat
        });

        return (
                <Navbar id="header" expand="md" dark color="dark">
                    <Container className={className}>
                        <NavbarBrand tag={RRNavLink} to="/">
                                <img className={Style.brandImage} src={logo}/>
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle}/>
                        <Collapse isOpen={isOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink to="/faq" tag={RRNavLink}>FAQ</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/hallOfFame" tag={RRNavLink}>Hall of fame</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink target="_blank" href={CONTRACT_URL}>Contract</NavLink>
                                </NavItem>
                                <NavItem className="d-md-none">
                                    <NavLink href="#" onClick={this.onToggleChat}>Chat</NavLink>
                                </NavItem>
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                {authenticated ? [
                                    <NavItem key="1">
                                        <NavLink tag={RRNavLink} to="/account">Account</NavLink>
                                    </NavItem>,
                                    <NavItem key="2">
                                        <NavLink tag={RRNavLink} to="/logout">Logout</NavLink>
                                    </NavItem>
                                ] : [
                                    <NavItem key="1">
                                        <RegisterNavItem/>
                                    </NavItem>,
                                    <NavItem key="2">
                                        <NavLink href="#" onClick={this.props.authenticate}>Login</NavLink>
                                    </NavItem>
                                ]}
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
        );
    }
}

export default Header;
