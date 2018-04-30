import * as React from 'react'

import {Ether} from '../../reusable';
import {Stat} from './types';
import User from "../../platform/components/user/User";

type Props = {
    index: number,
    stat: Stat
}

const StatsRow = ({index, stat}: Props) => {
    return (
        <tr>
            <td>{index}</td>
            <td><User user={stat.user}/></td>
            <td><Ether showCurrencySymbol={false} gwei={stat.value}/></td>
        </tr>
    );
};

export default StatsRow;
