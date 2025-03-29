import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import {connect} from "react-redux";
import {NavLink as RRNavLink, Route, Routes} from "react-router-dom";
import {Nav, NavItem, NavLink} from "reactstrap";
import {bindActionCreators} from "redux";

import {User} from "../../platform/modules/account/types";
import {showUserModal} from "../../platform/modules/modals/slice";
import {Col, Container, DataLoader, Row} from "../../reusable/index";
import {Dispatch} from "../../util/util";
import StatsTable from "./StatsTable";

import * as Style from "./HallOfFame.scss";
import {Helmet} from "react-helmet";
import PathNotFound from "../../app/PathNotFound";

type StatsEntryProps = {
    timeSpan: string;
    showUserModal(user: User): void;
};

const StatsEntry = ({timeSpan, showUserModal}: StatsEntryProps) => (
    <DataLoader
        url={`/stats/${timeSpan}`}
        success={(stats) => (
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
        dispatch,
    );

type Props = ReturnType<typeof mapDispatchToProps> & WithTranslation;

class HallOfFame extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {showUserModal, t} = this.props;

        return (
            <>
                <Helmet>
                    <title>Hall of Fame - Dicether</title>
                    <meta name="description" content="Top players at Dicether" />
                </Helmet>
                <Container>
                    <h2 className={Style.heading}>Hall of Fame</h2>
                    <Nav pills className={Style.selection}>
                        <NavItem>
                            <NavLink tag={RRNavLink} to="../weekly" relative="path">
                                {t("weekly")}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={RRNavLink} to="../monthly" relative="path">
                                {t("monthly")}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={RRNavLink} to="../all" relative="path">
                                {t("all")}
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <Routes>
                        <Route
                            path="weekly"
                            element={<StatsEntry timeSpan="week" showUserModal={(user) => showUserModal({user})} />}
                        />
                        <Route
                            path="monthly"
                            element={<StatsEntry timeSpan="month" showUserModal={(user) => showUserModal({user})} />}
                        />
                        <Route
                            path="all"
                            element={<StatsEntry timeSpan="all" showUserModal={(user) => showUserModal({user})} />}
                        />
                        <Route path="*" element={<PathNotFound />} />
                    </Routes>
                </Container>
            </>
        );
    }
}

export default withTranslation()(connect(null, mapDispatchToProps)(HallOfFame));
