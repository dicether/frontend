import * as React from 'react';

import {Stats as StatsType, User} from "../../modules/account/types";
import axios from "axios";
import GameStats from "../../../pages/account/components/stats/GameStats";
import {Address} from '../../../reusable';

const Style = require('./UserInfo.scss');


type Props = {
    user: User;
};

type State = {
    stats?: StatsType;
};


export default class UserInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            stats: undefined
        }
    }

    componentWillMount() {
        this.fetchData(this.props.user.address);
    }

    fetchData = (address: string) => {
        axios.get(`/userStats/${address}`).then(response => {
            const stats = response.data;
            this.setState({stats});
        }).catch(console.log);
    };

    render() {
        const {stats} = this.state;
        const {user} = this.props;

        return (
            <div className={Style.userInfo}>
                <h3 className="text-center">{user.username}</h3>
                <Address address={user.address} />
                {stats !== undefined &&
                    <GameStats stats={stats} />
                }
            </div>
        );

    }
}
