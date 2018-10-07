import * as React from "react";

const Style = require("./DefinitionEntry.scss");

type Props = {
    name: string;
    value: any;
};

const DefinitionEntry = ({name, value}: Props) => (
    <div className={Style.definitionEntry}>
        <dt className={Style.definitionEntry__key}>{name}</dt>
        <dd className={Style.definitionEntry__value}>{value}</dd>
    </div>
);

export default DefinitionEntry;
