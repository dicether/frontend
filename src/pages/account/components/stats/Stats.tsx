import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import GameSessions from "./GameSessions";
import GameStats from "./GameStats";
import {loadGameSessions, loadStats} from "../../../../platform/modules/account/asyncActions";
import {getUser} from "../../../../platform/modules/account/selectors";
import {State} from "../../../../rootReducer";
import {Dispatch} from "../../../../util/util";

const mapStateToProps = (state: State) => {
    const {stats, gameSessions} = state.account;

    return {
        userAuth: getUser(state),
        stats,
        gameSessions,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            loadStats,
        },
        dispatch,
    );

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class Stats extends React.PureComponent<Props> {
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
        const {stats, gameSessions} = this.props;

        return (
            <div>
                <GameStats stats={stats} />
                <GameSessions gameSessions={gameSessions} />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
