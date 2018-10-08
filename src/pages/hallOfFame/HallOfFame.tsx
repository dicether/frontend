import * as React from "react";
import DocumentTitle from "react-document-title";
import {connect} from "react-redux";
import {NavLink as RRNavLink} from "react-router-dom";
import {Nav, NavItem, NavLink} from "reactstrap";

import {Redirect, Route, RouteComponentProps, Switch} from "react-router";
import {bindActionCreators} from "redux";
import {showUserModal} from "../../platform/modules/modals/actions";
import {Col, Container, DataLoader, Row} from "../../reusable/index";
import {Dispatch} from "../../util/util";
import StatsTable from "./StatsTable";

const Style = require("./HallOfFame.scss");

const StatsEntry = ({timeSpan, showUserModal}) => (
    <DataLoader
        url={`/stats/${timeSpan}`}
        success={stats => (
            <Row>
                <Col md={6}>
                    <StatsTable
                        title="Most Wagered"
                        name="Wagered"
                        data={stats.mostWagered}
                        showUserModal={showUserModal}
                    />
                </Col>
                <Col md={6}>
                    <StatsTable
                        title="Most Profit"
                        name="Profit"
                        data={stats.mostProfit}
                        showUserModal={showUserModal}
                    />
                </Col>
            </Row>
        )}
    />
);

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            showUserModal,
        },
        dispatch
    );

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<any>;

class HallOfFame extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Props) {
        return this.props.location.pathname !== nextProps.location.pathname;
    }

    render() {
        const {match, showUserModal} = this.props;

        const weekEntry = () => <StatsEntry timeSpan="week" showUserModal={user => showUserModal({user})} />;
        const monthEntry = () => <StatsEntry timeSpan="month" showUserModal={user => showUserModal({user})} />;
        const allEntry = () => <StatsEntry timeSpan="all" showUserModal={user => showUserModal({user})} />;

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
                        <Route exact path={`${match.path}`} render={() => <Redirect to={`${match.path}/weekly`} />} />
                        <Route exact path={`${match.path}/weekly`} component={weekEntry} />
                        <Route exact path={`${match.path}/monthly`} component={monthEntry} />
                        <Route exact path={`${match.path}/all`} component={allEntry} />
                    </Switch>
                </Container>
            </DocumentTitle>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(HallOfFame);
