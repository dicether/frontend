import * as React from "react";
import {Button, DefinitionEntry, Ether, Form} from "../../../../reusable";

type Props = {
    balance: number,
    withDrawBalance(): void
}

const Balance = ({balance, withDrawBalance}) => (
    <div style={{marginBottom: "2rem"}}>
        <dl>
            <DefinitionEntry name="Available affiliate balance:" value={<Ether gwei={balance}/>}/>
        </dl>
        <Button disabled={balance === 0} size="sm" color="primary" onClick={withDrawBalance}>Withdraw Balance</Button>
    </div>
);

export default Balance;
