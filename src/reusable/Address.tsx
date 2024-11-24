import * as React from "react";

import * as Style from "./Address.scss";

const Address = ({address}: {address: string}) => (
    <a rel="noreferrer" target="_blank" href={`https://etherscan.io/address/${address}`} className={Style.address}>
        {address}
    </a>
);

export default Address;
