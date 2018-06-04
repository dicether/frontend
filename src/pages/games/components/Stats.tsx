import * as React from 'react';
import {NavItem, NavLink, TabPane, Nav, TabContent} from 'reactstrap';
import { connect } from 'react-redux';

import BetsList from './BetsList';
import {Dispatch} from '../../../util/util';
import {State} from '../../../rootReducer';
import {getUser} from "../../../platform/modules/account/selectors";
import {loadBets, loadMyBets} from '../../../platform/modules/bets/asyncActions';
import {addBet, addMyBet} from "../../../platform/modules/bets/actions";
import {bindActionCreators} from "redux";


const Style = require('./Stats.scss');



const mapStateToProps = (state: State) => {
    const {bets} = state;
    const {allBets, myBets} = bets;

    return {
        userAuth: getUser(state),
        allBets,
        myBets,
    };
};


const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    loadBets,
    loadMyBets,
    addBet,
    addMyBet
}, dispatch);


type OtherProps = {
    showMyBets: boolean
}


type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OtherProps;

type Tab = 'allBets' | 'myBets';

type CompState = {
    activeTab: Tab
}

class Stats extends React.Component<Props, CompState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            activeTab: 'allBets'
        }
    }

    componentWillMount() {
        const {loadBets, loadMyBets, userAuth} = this.props;

        loadBets();

        if (userAuth !== null) {
            loadMyBets(userAuth.address);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        const {userAuth: previousUser} = this.props;
        const {userAuth: nextUser, loadMyBets} = nextProps;
        if ((nextUser !== null && previousUser !== null && previousUser.address !== nextUser.address) ||
                (previousUser === null && nextUser !== null)) {
            loadMyBets(nextUser.address);
        }
    }

    toggle = (tab: Tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };

    render() {
        const {allBets, myBets, showMyBets} = this.props;
        const {activeTab} = this.state;

        return (
            <div className={Style.stats}>
                {showMyBets &&
                <Nav pills className={Style.betSelection}>
                    <NavItem>
                        <NavLink
                            href="#"
                            className={activeTab === 'allBets' ? 'active' : ''}
                            onClick={() => this.toggle('allBets')}
                        >
                            All Bets
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            href="#"
                            className={activeTab === 'myBets' ? 'active' : ''}
                            onClick={() => this.toggle('myBets')}
                        >
                            My Bets
                        </NavLink>
                    </NavItem>
                </Nav>
                }
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="allBets">
                        <BetsList bets={allBets}/>
                    </TabPane>
                    <TabPane tabId="myBets">
                        <BetsList bets={myBets} showUser={false}/>
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stats);