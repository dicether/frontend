import * as React from 'react';

const Style = require('./Address.scss');

const Address = ({address}: { address: string }) => (
    <a target='_blank'
       href={`https://etherscan.io/address/${address}`}
       className={Style.address}>{address}</a>
);

export default Address;
