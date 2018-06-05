import * as React from 'react';
import {Container, Nav, NavItem, NavLink} from 'reactstrap';
import {NavLink as RRNavLink} from 'react-router-dom';

import {NAME, TWITTER_URL, CONTACT_URL, DISCORD_URL, REDDIT_URL, GITHUB_URL} from '../config/config';
import {Col} from '../reusable';

const logo = require('assets/images/logoTop.svg');

const Style = require('./Footer.scss');


type Props = {
    showChat: boolean
}

const Footer = ({showChat} : Props) => {
    const className = showChat ? 'container-chat-open' : '';

    return (
        <footer className={Style.footer}>
            <nav className="navbar navbar-dark bg-dark">
                <Container className={className}>
                        <Col className={Style.brand + ' order-sm-2 my-auto'} sm={{size: 4}} xs={12}>
                            <NavLink to="/" tag={RRNavLink}>
                                <img className={Style.logo} src={logo}/>
                            </NavLink>
                            <span className={Style.copyright}>©2017 {NAME}. All Rights Reserved</span>
                        </Col>
                        <Col className="my-auto order-sm-1" sm={{size: 4}} xs={12}>
                            <Nav navbar style={{alignItems: 'center'}}>
                                <NavItem>
                                    <NavLink href={`mailto:${CONTACT_URL}`}>Contact</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href={GITHUB_URL}>GitHub</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="https://www.begambleaware.org">Gamble Aware</NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                        <Col className="my-auto order-sm-3" sm={{size: 4}} xs={12}>
                            <Nav navbar style={{alignItems: 'center'}}>
                                <NavItem>
                                    <NavLink href={TWITTER_URL}>Twitter</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href={DISCORD_URL}>Discord</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href={REDDIT_URL}>Reddit</NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                </Container>
            </nav>
        </footer>
    );
};

export default Footer;
