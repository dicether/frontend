import ClassName from "classnames";
import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import {NavLink as RRNavLink} from "react-router-dom";
import {Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from "reactstrap";

import {CONTRACT_URL} from "../config/config";
import {IconButton} from "../reusable/index";

const Style = require("./Header.scss");

const logo = require("assets/images/logoTop.svg");

interface Props extends WithTranslation {
    authenticated: boolean;
    showChat: boolean;
    nightMode: boolean;
    toggleChat(show: boolean): void;
    authenticate(): void;
    showRegisterModal(): void;
    toggleTheme(nightMode: boolean): void;
}

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
    };

    onToggleChat = () => {
        const {showChat, toggleChat} = this.props;
        toggleChat(!showChat);
    };

    onToggleTheme = () => {
        const {nightMode, toggleTheme} = this.props;
        toggleTheme(!nightMode);
    };

    render() {
        const {authenticated, showRegisterModal, showChat, nightMode, t} = this.props;
        const {isOpen} = this.state;

        const className = ClassName({
            "container-chat-open": showChat,
        });

        return (
            <Navbar id="header" expand="md" dark color="dark">
                <Container className={className}>
                    <NavbarBrand className={Style.brand} tag={RRNavLink} to="/" onClick={this.toggle}>
                        <div className={Style.brandImageContainer}>
                            <img className={Style.brandImage} src={logo} />
                        </div>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink to="/faq" tag={RRNavLink} onClick={this.toggle}>
                                    {t("FAQ")}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/hallOfFame" tag={RRNavLink} onClick={this.toggle}>
                                    {t("hallOfFame")}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink target="_blank" href={CONTRACT_URL}>
                                    {t("contract")}
                                </NavLink>
                            </NavItem>
                            <NavItem className="d-md-none">
                                <NavLink href="#" onClick={this.onToggleChat}>
                                    {t("chat")}
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
                                              {t("account")}
                                          </NavLink>
                                      </NavItem>,
                                      <NavItem key="2">
                                          <NavLink tag={RRNavLink} to="/logout">
                                              {t("logout")}
                                          </NavLink>
                                      </NavItem>,
                                  ]
                                : [
                                      <NavItem key="1">
                                          <NavLink id="register" href="#" onClick={showRegisterModal}>
                                              {t("register")}
                                          </NavLink>
                                      </NavItem>,
                                      <NavItem key="2">
                                          <NavLink href="#" onClick={this.props.authenticate}>
                                              {t("login")}
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

export default withTranslation()(Header);
