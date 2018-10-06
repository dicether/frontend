import axios from "axios";
import * as React from "react";

import {connect} from "react-redux";
import {showSuccessMessage} from "../../../../platform/modules/utilities/actions";
import {catchError} from "../../../../platform/modules/utilities/asyncActions";
import {Dispatch} from "../../../../util/util";
import Balance from "./Balance";
import Campaigns from "./Campaigns";
import CreateCampaign from "./CreateCampaign";
import {Campaign} from "./types";

const mapDispatchToProps = (dispatch: Dispatch) => ({
    catchError: error => catchError(error, dispatch),
    showSuccessMessage: message => dispatch(showSuccessMessage(message)),
});

type State = {
    campaigns: Campaign[];
    balance: number;
};

type Props = ReturnType<typeof mapDispatchToProps>;

class Affiliate extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            campaigns: [],
            balance: 0,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const {catchError} = this.props;
        axios
            .get("/affiliate/campaigns")
            .then(response => {
                this.setState({
                    campaigns: response.data.campaigns,
                    balance: response.data.balance,
                });
            })
            .catch(error => catchError(error));
    }

    createCampaign = (id: string, name: string) => {
        const {catchError, showSuccessMessage} = this.props;
        axios
            .post("/affiliate/createCampaign", {id, name})
            .then(response => {
                const campaign = response.data;
                this.setState({
                    campaigns: [...this.state.campaigns, campaign],
                });
                showSuccessMessage(`Created new campaign ${name}!`);
            })
            .catch(error => catchError(error));
    }

    withdrawBalance = () => {
        const {catchError, showSuccessMessage} = this.props;
        axios
            .post("/affiliate/withdraw")
            .then(() => {
                this.setState({
                    balance: 0,
                });
                showSuccessMessage("Balance withdrawn!");
            })
            .catch(error => catchError(error));
    }

    render() {
        const {campaigns, balance} = this.state;

        return (
            <div>
                <div>
                    <p>
                        Dicether offers a 10% affiliate system. You will receive commission from every user you refer.
                        For every game session of the referred users, you get commission of the house profit.
                    </p>
                </div>
                <Balance balance={balance} withDrawBalance={this.withdrawBalance} />
                <CreateCampaign onCreateCampaign={this.createCampaign} />
                <Campaigns campaigns={campaigns} />
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Affiliate);
