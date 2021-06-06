import * as React from "react";
import {connect} from "react-redux";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";

import {bindActionCreators} from "redux";
import {State} from "../../../rootReducer";
import {Dispatch} from "../../../util/util";
import {getUser} from "../../modules/account/selectors";
import {addBet, addMyBet} from "../../modules/bets/actions";
import {loadBets, loadMyBets} from "../../modules/bets/asyncActions";
import {showBetModal, showUserModal} from "../../modules/modals/actions";
import BetsList from "./BetsList";

import Style from "./Stats.scss";

const mapStateToProps = (state: State) => {
    const {bets} = state;
    const {allBets, myBets} = bets;

    return {
        userAuth: getUser(state),
        allBets,
        myBets,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            loadBets,
            loadMyBets,
            addBet,
            addMyBet,
            showBetModal,
            showUserModal,
        },
        dispatch
    );

type OtherProps = {
    showMyBets: boolean;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OtherProps;

type Tab = "allBets" | "myBets";

type CompState = {
    activeTab: Tab;
};

class Stats extends React.Component<Props, CompState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            activeTab: "myBets",
        };
    }

    componentWillReceiveProps(newProps: Props) {
        if (!this.props.userAuth && newProps.userAuth) {
            this.setState({activeTab: "myBets"});
        }
    }

    toggle = (tab: Tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        const {allBets, myBets, showMyBets, showBetModal, showUserModal} = this.props;
        const {activeTab} = this.state;
        const curActiveTab = showMyBets ? activeTab : "allBets";

        return (
            <div className={Style.stats}>
                {showMyBets && (
                    <Nav pills className={Style.betSelection}>
                        <NavItem>
                            <NavLink
                                href="#"
                                className={activeTab === "allBets" ? "active" : ""}
                                onClick={() => this.toggle("allBets")}
                            >
                                All Bets
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                href="#"
                                className={activeTab === "myBets" ? "active" : ""}
                                onClick={() => this.toggle("myBets")}
                            >
                                My Bets
                            </NavLink>
                        </NavItem>
                    </Nav>
                )}
                <TabContent activeTab={curActiveTab}>
                    <TabPane tabId="allBets">
                        <BetsList
                            bets={allBets}
                            showBetModal={bet => showBetModal({bet})}
                            showUserModal={user => showUserModal({user})}
                        />
                    </TabPane>
                    <TabPane tabId="myBets">
                        <BetsList
                            bets={myBets}
                            showUser={false}
                            showBetModal={bet => showBetModal({bet})}
                            showUserModal={user => showUserModal({user})}
                        />
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Stats);
