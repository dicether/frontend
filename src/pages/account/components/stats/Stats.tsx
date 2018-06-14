import * as React from "react";
import GameStats from "./GameStats";
import GameSessions from "./GameSessions";
import {Address, Tooltip} from "../../../../reusable";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {loadGameSessions, loadStats} from "../../../../platform/modules/account/asyncActions";
import {State} from "../../../../rootReducer";
import {getUser} from "../../../../platform/modules/account/selectors";

const Style = require('./Stats.scss');


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

class Stats extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props)
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
            <div>
                <GameStats stats={stats}/>
                <GameSessions gameSessions={gameSessions}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
