import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import {NavLink as RRNavLink} from "react-router-dom";
import {Container, Nav, NavItem, NavLink} from "reactstrap";

import {CONTACT_URL, DISCORD_URL, GITHUB_URL, NAME, REDDIT_URL, TWITTER_URL, BUILD_DATE} from "../config/config";
import {Col} from "../reusable";

import logo from "assets/images/logoTop.svg";

import * as Style from "./Footer.scss";

interface Props extends WithTranslation {
    showChat: boolean;
}

const Footer = ({showChat, t}: Props) => {
    const className = showChat ? "container-chat-open" : "";

    return (
        <footer>
            <nav className="navbar navbar-dark bg-dark">
                <Container className={className}>
                    <Col className={Style.brand + " order-sm-2 my-auto"} sm={{size: 4}} xs={12}>
                        {/*<LanguageSelector />*/}
                        <NavLink to="/" tag={RRNavLink}>
                            <img className={Style.logo} src={logo} />
                        </NavLink>
                        <span className={Style.copyright}>
                            ©{BUILD_DATE.getUTCFullYear()} {NAME}. All Rights Reserved
                        </span>
                    </Col>
                    <Col className="my-auto order-sm-1" sm={{size: 4}} xs={12}>
                        <Nav navbar style={{alignItems: "center"}}>
                            <NavItem>
                                <NavLink href={`mailto:${CONTACT_URL}`}>{t("contact")}</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href={GITHUB_URL}>{t("GitHub")}</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://www.begambleaware.org">{t("gambleAware")}</NavLink>
                            </NavItem>
                        </Nav>
                    </Col>
                    <Col className="my-auto order-sm-3" sm={{size: 4}} xs={12}>
                        <Nav navbar style={{alignItems: "center"}}>
                            <NavItem>
                                <NavLink href={TWITTER_URL}>{t("twitter")}</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href={DISCORD_URL}>{t("discord")}</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href={REDDIT_URL}>{t("reddit")}</NavLink>
                            </NavItem>
                        </Nav>
                    </Col>
                </Container>
            </nav>
        </footer>
    );
};

export default withTranslation()(Footer);
