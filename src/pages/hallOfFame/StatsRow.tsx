import * as React from "react";

import {User} from "../../platform/modules/account/types";
import {Ether} from "../../reusable";
import {Stat} from "./types";

import Style from "./StatsRow.scss";

type Props = {
    index: number;
    stat: Stat;
    showUserModal(user: User): void;
};

const StatsRow = ({index, stat, showUserModal}: Props) => {
    return (
        <tr>
            <td>{index}</td>
            <td>
                <button className={Style.userButton} onClick={() => showUserModal(stat.user)}>
                    {stat.user.username}
                </button>
            </td>
            <td>
                <Ether showCurrencySymbol={false} gwei={stat.value} />
            </td>
        </tr>
    );
};

export default StatsRow;
