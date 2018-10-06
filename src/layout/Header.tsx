import ClassName from "classnames";
import * as React from "react";
import {NavLink as RRNavLink} from "react-router-dom";
import {Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from "reactstrap";

import {CONTRACT_URL} from "../config/config";
import {IconButton} from "../reusable/index";

const Style = require("./Header.scss");

const logo = require("assets/images/logoTop.svg");

type Props = {
    authenticated: boolean;
    showChat: boolean;
    nightMode: boolean;
    toggleChat(show: boolean): void;
    authenticate(): void;
    showRegisterModal(): void;
    toggleTheme(nightMode: boolean): void;
};

type State = {
    isOpen: boolean;
    showRegister: boolean;
};

class Header extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isOpen: false,
            showRegister: false,
        };
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    onToggleChat = () => {
        const {showChat, toggleChat} = this.props;
        toggleChat(!showChat);
    }

    onToggleTheme = () => {
        const {nightMode, toggleTheme} = this.props;
        toggleTheme(!nightMode);
    }

    render() {
        const {authenticated, showRegisterModal, showChat, nightMode} = this.props;
        const {isOpen} = this.state;

        const className = ClassName({
            "container-chat-open": showChat,
        });

        return (
            <Navbar id="header" expand="md" dark color="dark">
                <Container className={className}>
                    <NavbarBrand tag={RRNavLink} to="/">
                        <img className={Style.brandImage} src={logo} />
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink to="/faq" tag={RRNavLink}>
                                    FAQ
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/hallOfFame" tag={RRNavLink}>
                                    Hall of fame
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink target="_blank" href={CONTRACT_URL}>
                                    Contract
                                </NavLink>
                            </NavItem>
                            <NavItem className="d-md-none">
                                <NavLink href="#" onClick={this.onToggleChat}>
                                    Chat
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink>
                                    <IconButton
                                        icon={"lightbulb"}
                                        color={nightMode ? "yellow" : "secondary"}
                                        onClick={this.onToggleTheme}
                                    />
                                </NavLink>
                            </NavItem>
                            {authenticated
                                ? [
                                      <NavItem key="1">
                                          <NavLink tag={RRNavLink} to="/account">
                                              Account
                                          </NavLink>
                                      </NavItem>,
                                      <NavItem key="2">
                                          <NavLink tag={RRNavLink} to="/logout">
                                              Logout
                                          </NavLink>
                                      </NavItem>,
                                  ]
                                : [
                                      <NavItem key="1">
                                          <NavLink id="register" href="#" onClick={showRegisterModal}>
                                              Register
                                          </NavLink>
                                      </NavItem>,
                                      <NavItem key="2">
                                          <NavLink href="#" onClick={this.props.authenticate}>
                                              Login
                                          </NavLink>
                                      </NavItem>,
                                  ]}
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default Header;
