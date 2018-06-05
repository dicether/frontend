import * as React from 'react'
import {NavLink as RRNavLink} from 'react-router-dom';
import {NavItem, NavLink, Nav} from 'reactstrap';

import {Row, Col, Container} from '../../reusable/index'
import StatsTable from './StatsTable'
import {Stats} from "./types";
import axios from "axios";
import {Redirect, Route, RouteComponentProps, Switch} from "react-router";
import {lstatSync} from "fs";

const Style = require('./HallOfFame.scss');


const StatsEntry = ({stats}) => (
    <Row>
        <Col md={6}>
            <StatsTable title="Most Wagered" name="Wagered" data={stats.mostWagered}/>
        </Col>
        <Col md={6}>
            <StatsTable title="Most Profit" name="Profit" data={stats.mostProfit}/>
        </Col>
    </Row>
);



type Props = RouteComponentProps<any>;

type State = {
    stats: Stats
}

const defaultEntry = {
    mostWagered: [],
    mostProfit: [],
};

class HallOfFame extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            stats: {
                all: defaultEntry,
                day: defaultEntry,
                week: defaultEntry,
                month: defaultEntry
            }
        }
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = () => {
        axios.get('stats').then(response => {
            const stats = response.data;
            this.setState({stats});
        }).catch(console.log);
    };


    render() {
        const {stats} = this.state;
        const {match} = this.props;

        const weekEntry = () =>  <StatsEntry stats={stats.week}/>;
        const monthEntry = () =>  <StatsEntry stats={stats.month}/>;
        const allEntry = () =>  <StatsEntry stats={stats.all}/>;

        return (
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
        );
    }
}

export default HallOfFame;
