import * as React from 'react';
import axios from 'axios';

import Campaigns from "./Campaigns";
import {Campaign} from "./types";
import CreateCampaign from "./CreateCampaign";
import {catchError} from "../../../../platform/modules/utilities/asyncActions";
import {DispatchProp} from "../../../../util/util";
import {connect} from "react-redux";
import {DefinitionEntry} from "../../../../reusable";
import Balance from "./Balance";


type Props = DispatchProp

type State = {
    campaigns: Campaign[],
    balance: number
}

class Affiliate extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            campaigns: [],
            balance: 0
        }
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = () => {
        const {dispatch} = this.props;
        axios.get('/affiliate/campaigns').then(response => {
            this.setState({
                campaigns: response.data.campaigns,
                balance: response.data.balance
            })
        }).catch(error => catchError(error, dispatch));
    };

    createCampaign = (id: string, name: string) => {
        const {dispatch} = this.props;
        axios.post('/affiliate/createCampaign', {id, name}).then(response => {
            const campaign = response.data;
            this.setState({
                campaigns: [...this.state.campaigns, campaign]
            })
        }).catch(error => catchError(error, dispatch));
    };

    withdrawBalance = () => {
        const {dispatch} = this.props;
        axios.post('/affiliate/withdraw').then(() => {
            this.setState({
                balance: 0
            })
        }).catch(error => catchError(error, dispatch));
    };

    render() {
        const {campaigns, balance} = this.state;

        return (
            <div>
                <div>
                    <p>
                        Dicether offers a 10% affiliate system. You will receive commission from
                        every user you refer. For every game session of the referred users, you get
                        commission of the house profit.
                    </p>
                </div>
                <Balance balance={balance} withDrawBalance={this.withdrawBalance}/>
                <CreateCampaign onCreateCampaign={this.createCampaign}/>
                <Campaigns campaigns={campaigns}/>
            </div>
        )
    }
}

export default connect()(Affiliate);
