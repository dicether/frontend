import * as React from "react";
import {WithNamespaces, withNamespaces} from "react-i18next";

import {Button, DefinitionEntry, Ether} from "../../../../reusable";

interface Props extends WithNamespaces {
    balance: number;
    withDrawBalance(): void;
}

const Balance = ({balance, withDrawBalance, t}: Props) => (
    <div style={{marginBottom: "2rem"}}>
        <dl>
            <DefinitionEntry name="Available affiliate balance:" value={<Ether gwei={balance} />} />
        </dl>
        <Button disabled={balance === 0} size="sm" color="primary" onClick={withDrawBalance}>
            {t("withdrawBalance")}
        </Button>
    </div>
);

export default withNamespaces()(Balance);
