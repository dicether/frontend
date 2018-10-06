import moment from "moment";
import * as React from "react";

import {Button, Ether, Modal, Table} from "../../../reusable/index";
import {Bet} from "../../modules/bets/types";
import User from "../user/User";
import BetInfo from "./BetInfo/index";

const Style = require("./BetList.scss");

type BetInfoModalProps = {
    bet: Bet;
};

class BetInfoModal extends React.Component<BetInfoModalProps, {isOpen: boolean}> {
    constructor(props: BetInfoModalProps) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        const {bet} = this.props;
        const {isOpen} = this.state;

        return (
            <React.Fragment>
                <Button className={Style.infoButton} key="1" color="link" onClick={this.toggle}>
                    Show
                </Button>
                <Modal key="2" isOpen={isOpen} toggle={this.toggle}>
                    <BetInfo bet={bet} />
                </Modal>
            </React.Fragment>
        );
    }
}

type LastBetRowProps = {
    bet: Bet;
    showUser: boolean;
};

const LastBetRow = ({bet, showUser}: LastBetRowProps) => {
    const {timestamp, user, value, profit} = bet;

    return (
        <tr>
            {showUser && (
                <td className={Style.center}>
                    <div className={Style.entry}>
                        {" "}
                        <User user={user} />{" "}
                    </div>
                </td>
            )}
            <td className={Style.center}>
                <div className={Style.entry}>{moment(timestamp).format("LT")}</div>
            </td>
            <td className={Style.center}>
                <div className={Style.entry}>
                    <Ether gwei={value} showCurrencySymbol />
                </div>
            </td>
            <td className={Style.center}>
                <div className={Style.entry}>
                    <BetInfoModal bet={bet} />
                </div>
            </td>
            <td className={Style.center}>
                <div className={Style.entry}>
                    <Ether gwei={profit} showCurrencySymbol colored />
                </div>
            </td>
        </tr>
    );
};

type Props = {
    bets: Bet[];
    showUser?: boolean;
};

const BetsList = ({bets, showUser = true}: Props) => {
    return (
        <Table hover noBorders responsive>
            <thead>
                <tr className="text-center">
                    {showUser && <th className={Style.center}>User</th>}
                    <th className={Style.center}>Time</th>
                    <th className={Style.center}>Bet</th>
                    <th className={Style.center}>Info</th>
                    <th className={Style.center}>Profit</th>
                </tr>
            </thead>
            <tbody className={Style.entries}>
                {bets.slice().map(bet => (
                    <LastBetRow key={bet.id} bet={bet} showUser={showUser} />
                ))}
            </tbody>
        </Table>
    );
};

export default BetsList;
