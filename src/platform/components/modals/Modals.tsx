import * as React from "react";
import MissingWalletModal from "./MissingWalletModal";
import RegisterModal from "./RegisterModal";



const Modals = () => (
    <React.Fragment>
        <MissingWalletModal/>
        <RegisterModal/>
    </React.Fragment>
);

export default Modals;
