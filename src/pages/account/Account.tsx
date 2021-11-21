import * as React from "react";
import {NavLink as RRNavLink, Redirect, Route, RouteComponentProps, Switch} from "react-router-dom";
import {Nav, Navbar, NavItem, NavLink} from "reactstrap";
import {Container} from "../../reusable";
import Affiliate from "./components/affiliate/Affiliate";
import Stats from "./components/stats/Stats";
import {Helmet} from "react-helmet";

type Props = RouteComponentProps<any>;

class Account extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {match} = this.props;

        return (
            <>
                <Helmet>
                    <title>Account - Dicether</title>
                    <meta name="description" content="Account management" />
                </Helmet>
                <Container>
                    <Navbar color="faded" light expand style={{marginLeft: "-1.5rem"}}>
                        <Nav navbar>
                            <NavItem>
                                <NavLink tag={RRNavLink} to={`${match.path}/stats`}>
                                    Statistics
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={RRNavLink} to={`${match.path}/affiliate`}>
                                    Affiliate
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Navbar>
                    <Switch>
                        <Route exact path={`${match.path}`} render={() => <Redirect to={`${match.path}/stats`} />} />
                        <Route exact path={`${match.path}/stats`} component={Stats} />
                        <Route exact path={`${match.path}/affiliate`} component={Affiliate} />
                    </Switch>
                </Container>
            </>
        );
    }
}

export default Account;
