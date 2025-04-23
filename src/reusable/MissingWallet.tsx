import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";

import {COINBASE_WALLET_URL, METAMASK_URL, TRUST_WALLET_URL} from "../config/config";

import * as Style from "./MissingWallet.scss";

import MetaMaskFox from "assets/images/metamask-fox.svg";
import TrustWalletLogo from "assets/images/trustwallet-logo.svg";
import CoinbaseWalletLogo from "assets/images/coinbasewallet-logo.svg";

const MissingWallet = ({t}: WithTranslation) => (
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

export default withTranslation()(MissingWallet);
