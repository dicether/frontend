import * as React from "react";

import {Table} from "../../reusable/index";
import StatsRow from "./StatsRow";

import {Stat} from "./types";

type Props = {
    data: Stat[];
    title: string;
    name: string;
};

const StatsTable = ({data, name, title}: Props) => (
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
                    <StatsRow key={i} index={i + 1} stat={stat} />
                ))}
            </tbody>
        </Table>
    </div>
);

export default StatsTable;
