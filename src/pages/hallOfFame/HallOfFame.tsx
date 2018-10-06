import * as React from 'react'
import DocumentTitle from 'react-document-title';
import {NavLink as RRNavLink} from 'react-router-dom';
import {NavItem, NavLink, Nav} from 'reactstrap';

import {Row, Col, Container, DataLoader} from '../../reusable/index'
import StatsTable from './StatsTable'
import {Redirect, Route, RouteComponentProps, Switch} from "react-router";

const Style = require('./HallOfFame.scss');



const StatsEntry = ({timeSpan}) => (
    <DataLoader
        url={`/stats/${timeSpan}`}
        success={ stats => (
            <Row>
                <Col md={6}>
                    <StatsTable title="Most Wagered" name="Wagered" data={stats.mostWagered}/>
                </Col>
                <Col md={6}>
                    <StatsTable title="Most Profit" name="Profit" data={stats.mostProfit}/>
                </Col>
            </Row>
        )}
    />
);



type Props = RouteComponentProps<any>;

class HallOfFame extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Props) {
        return this.props.location.pathname !== nextProps.location.pathname;
    }

    render() {
        const {match} = this.props;

        const weekEntry = () =>  <StatsEntry timeSpan="week"/>;
        const monthEntry = () =>  <StatsEntry timeSpan="month"/>;
        const allEntry = () =>  <StatsEntry timeSpan="all"/>;

        return (
            <DocumentTitle title="Hall of Fame - Dicether">
                <Container>
                    <h2 className={Style.heading}>Hall of Fame</h2>
                    <Nav pills className={Style.selection}>
                        <NavItem>
                            <NavLink tag={RRNavLink} to={`${match.path}/weekly`}>
                                Weekly
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={RRNavLink} to={`${match.path}/monthly`}>
                                Monthly
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={RRNavLink} to={`${match.path}/all`}>
                                All
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <Switch>
                        <Route exact path={`${match.path}`} render={() => <Redirect to={`${match.path}/weekly`}/>}/>
                        <Route exact path={`${match.path}/weekly`} component={weekEntry}/>
                        <Route exact path={`${match.path}/monthly`} component={monthEntry}/>
                        <Route exact path={`${match.path}/all`} component={allEntry}/>
                    </Switch>
                </Container>
            </DocumentTitle>
        );
    }
}

export default HallOfFame;
