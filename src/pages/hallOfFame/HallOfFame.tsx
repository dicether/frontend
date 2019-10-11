import * as React from "react";
import DocumentTitle from "react-document-title";
import {WithTranslation, withTranslation} from "react-i18next";
import {connect} from "react-redux";
import {NavLink as RRNavLink, Redirect, Route, RouteComponentProps, Switch} from "react-router-dom";
import {Nav, NavItem, NavLink} from "reactstrap";
import {bindActionCreators} from "redux";

import {User} from "../../platform/modules/account/types";
import {showUserModal} from "../../platform/modules/modals/actions";
import {Col, Container, DataLoader, Row} from "../../reusable/index";
import {Dispatch} from "../../util/util";
import StatsTable from "./StatsTable";

const Style = require("./HallOfFame.scss");

type StatsEntryProps = {
    timeSpan: string;
    showUserModal(user: User): void;
};

const StatsEntry = ({timeSpan, showUserModal}: StatsEntryProps) => (
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

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<any> & WithTranslation;

class HallOfFame extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Props) {
        return this.props.location.pathname !== nextProps.location.pathname;
    }

    render() {
        const {match, showUserModal, t} = this.props;

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
                                {t("weekly")}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={RRNavLink} to={`${match.path}/monthly`}>
                                {t("monthly")}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={RRNavLink} to={`${match.path}/all`}>
                                {t("all")}
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

export default withTranslation()(
    connect(
        null,
        mapDispatchToProps
    )(HallOfFame)
);
