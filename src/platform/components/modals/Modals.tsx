import * as React from "react";

import BetModal from "./BetModal";
import MissingWalletModal from "./MissingWalletModal";
import RegisterModal from "./RegisterModal";
import UserModal from "./UserModal";

const Modals = () => (
    <React.Fragment>
        <MissingWalletModal />
        <RegisterModal />
        <BetModal />
        <UserModal />
    </React.Fragment>
);

export default Modals;
