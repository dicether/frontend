import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {Tooltip} from '../../reusable/index';
import Stats from './components/Stats';
import {Address} from '../../reusable';

const Style = require('./Account.scss');
import {State} from "../../rootReducer";
import {getUser} from "../../platform/modules/account/selectors";
import {loadGameSessions, loadStats} from "../../platform/modules/account/asyncActions";
import GameSession from "../gameSession/GameSession";
import GameSessions from "./components/GameSessions";


const mapStateToProps = (state: State) => {
    const {stats, gameSessions} = state.account;

    return {
        userAuth: getUser(state),
        stats,
        gameSessions,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => bindActionCreators({
    loadStats,
}, dispatch);


type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class Account extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentWillMount() {
        const {loadStats, userAuth} = this.props;
        if (userAuth) {
            loadStats(userAuth.address);
            loadGameSessions(userAuth.address);
        }
    }


    render() {
        const {stats, gameSessions, userAuth} = this.props;

        return (
            <div className={Style.account}>
                {userAuth !== null &&
                    <div>
                        <h2 className={Style.username} id="username">{userAuth.username}</h2>
                        <Tooltip target="username">
                            <Address address={userAuth.address}/>
                        </Tooltip>
                    </div>
                }
                <Stats stats={stats}/>
                <GameSessions gameSessions={gameSessions}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
