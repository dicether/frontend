import * as React from 'react';
import {NavLink as RRNavLink, Redirect, Route, Switch} from 'react-router-dom';
import {NavItem, NavLink, Nav, Navbar, Collapse} from 'reactstrap';
import {RouteComponentProps} from "react-router";
import Stats from "./components/stats/Stats";
import Affiliate from "./components/affiliate/Affiliate";
import {Container} from "../../reusable";

const Style = require('./Account.scss');


type Props = RouteComponentProps<any>;

class Account extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {match} = this.props;
        const NavLinkX: React.StatelessComponent<any> = NavLink;

        return (
            <Container>
                <Navbar color="faded" light expand style={{marginLeft: "-1.5rem"}}>
                    <Nav navbar>
                        <NavItem>
                            <NavLinkX tag={RRNavLink} to={`${match.path}/stats`}>
                                Statistics
                            </NavLinkX>
                        </NavItem>
                        <NavItem>
                            <NavLinkX tag={RRNavLink} to={`${match.path}/affiliate`}>
                                Affiliate
                            </NavLinkX>
                        </NavItem>
                    </Nav>
                </Navbar>
                <Switch>
                    <Route exact path={`${match.path}`} render={() => <Redirect to={`${match.path}/stats`}/>}/>
                    <Route exact path={`${match.path}/stats`} component={Stats}/>
                    <Route exact path={`${match.path}/affiliate`} component={Affiliate}/>
                </Switch>
            </Container>
        );
    }
}

export default Account;
