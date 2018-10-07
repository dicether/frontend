import * as React from "react";

import BetModal from "./BetModal";
import MissingWalletModal from "./MissingWalletModal";
import RegisterModal from "./RegisterModal";

const Modals = () => (
    <React.Fragment>
        <MissingWalletModal />
        <RegisterModal />
        <BetModal />
    </React.Fragment>
);

export default Modals;
