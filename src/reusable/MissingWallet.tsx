import * as React from "react";
import {WithNamespaces, withNamespaces} from "react-i18next";

import {COINBASE_WALLET_URL, METAMASK_URL, TRUST_WALLET_URL} from "../config/config";

const Style = require("./MissingWallet.scss");

const MetaMaskFox = require("assets/images/metamask-fox.svg");
const TrustWalletLogo = require("assets/images/trustwallet-logo.svg");
const CoinbaseWalletLogo = require("assets/images/coinbasewallet-logo.svg");

const MissingWallet = ({t}: WithNamespaces) => (
    <div>
        <h4 className={Style.heading}>You need a Web3-compatible wallet!</h4>
        <div className={"hidden-sm-down " + Style.entry}>
            <img className={Style.logo} src={MetaMaskFox} />
            <span>
                {t("install")} <a href={METAMASK_URL}>MetaMask</a>
            </span>
        </div>
        <div className={"hidden-md-up " + Style.mobileDevice}>
            <div className={Style.entry}>
                <img className={Style.logo} src={TrustWalletLogo} />
                <span>
                    {t("use")} <a href={TRUST_WALLET_URL}>Trust Wallet</a>
                </span>
            </div>
            <span className="text-center">{t("or")}</span>
            <div className={Style.entry}>
                <img className={Style.logo} src={CoinbaseWalletLogo} />
                <span>
                    {t("use")} <a href={COINBASE_WALLET_URL}>Coinbase Wallet</a>
                </span>
            </div>
        </div>
    </div>
);

export default withNamespaces()(MissingWallet);
