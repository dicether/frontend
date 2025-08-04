import * as React from "react";

import StatsRow from "./StatsRow";
import {Stat} from "./types";
import {User} from "../../platform/modules/account/types";
import {Table} from "../../reusable/index";

interface Props {
    data: Stat[];
    title: string;
    name: string;
    showUserModal: (user: User) => void;
}

const StatsTable = ({data, name, title, showUserModal}: Props) => (
    <div>
        <h5 className="text-center">{title}</h5>
        <Table hover striped>
            <thead>
                <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>{name}</th>
                </tr>
            </thead>
            <tbody>
                {data.map((stat, i) => (
                    <StatsRow key={i} index={i + 1} stat={stat} showUserModal={showUserModal} />
                ))}
            </tbody>
        </Table>
    </div>
);

export default StatsTable;
