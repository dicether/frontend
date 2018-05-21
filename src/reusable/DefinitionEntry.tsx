import * as React from "react";

const Style = require("./DefinitionEntry.scss");

type Props = {
    name: string,
    value: any
}

const DefinitionEntry = ({name, value}: Props) => (
     <div className={Style.entry}>
        <dt className={Style.entry__key}>{name}</dt>
        <dd className={Style.entry__value}>{value}</dd>
    </div>
);

export default DefinitionEntry;
