import * as React from 'react';
import DocumentTitle from 'react-document-title';
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

        return (
            <DocumentTitle title="Account - Dicether">
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
                        <Route exact path={`${match.path}`} render={() => <Redirect to={`${match.path}/stats`}/>}/>
                        <Route exact path={`${match.path}/stats`} component={Stats}/>
                        <Route exact path={`${match.path}/affiliate`} component={Affiliate}/>
                    </Switch>
                </Container>
            </DocumentTitle>
        );
    }
}

export default Account;
