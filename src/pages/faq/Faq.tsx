import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import {Helmet} from "react-helmet";

import {
    BUGS_URL,
    COINBASE_WALLET_URL,
    CONTACT_URL,
    CONTRACT_URL,
    GITHUB_URL,
    METAMASK_URL,
    TRUST_WALLET_URL,
} from "../../config/config";
import {Container} from "../../reusable";

import * as Style from "./Faq.scss";

const Faq = ({t}: WithTranslation) => (
    <>
        <Helmet>
            <title>Faq - Dicether</title>
            <meta name="description" content="What is Dicether? Why is Dicether better than other casinos?" />
        </Helmet>
        <Container>
            <h2 className={Style.heading}>{t("FAQ")}</h2>
            <div className={Style.entry}>
                <h5>{t("faq.whatIsDicether.question")}</h5>
                <p>{t("faq.whatIsDicether.answer")}</p>
            </div>
            <div className={Style.entry}>
                <h5>{t("faq.betterThanOtherSolution.question")}</h5>
                <p>{t("faq.betterThanOtherSolution.answer")}</p>
            </div>
            <div className={Style.entry}>
                <h5>{t("faq.whatIsSecure.question")}</h5>
                <Trans i18nKey="faq.whatIsSecure.answer">
                    <p>
                        When you start a game session we and you, the customer, generate a hash chain and send the last
                        entry to the smart contract. Additional to the hash value, you send your funds for playing,
                        which will be securely locked in the smart contract (we can not access your money). For every
                        round playing dice a previous entry of your and our hash chain is combined and from that the
                        resulting dice roll generated! The result is verified and, if everything is ok, signed by you
                        and us. The next round can start. If you are finished with playing the final result is signed
                        and send to contract, which sends back your funds plus your profit or minus your loss.
                    </p>
                    <p>
                        So the only interaction with the blockchain is happening during starting and ending the game
                        session. Between you can play as many games as you want. No blockchain interaction is necessary!
                    </p>
                    <p>
                        The smart contract is verified at <a href={CONTRACT_URL}>Etherscan</a>. So you can check
                        yourself that everything is working as described. To have a look at our front-end source code
                        you can visit our <a href={GITHUB_URL}>github</a> repositories.
                    </p>
                </Trans>
            </div>
            <div className={Style.entry}>
                <h5>{t("faq.houseEdge.question")}</h5>
                <p>{t("faq.houseEdge.answer")}</p>
            </div>
            <div className={Style.entry}>
                <h5>{t("faq.howToRegister.question")}</h5>
                <p>{t("faq.howToRegister.answer")}</p>
            </div>
            <div className={Style.entry}>
                <h5>{t("faq.cantPlaceBet.question")}</h5>
                <p>
                    <Trans i18nKey="faq.cantPlaceBet.answer">
                        To play you need to be logged in and you need to have installed
                        <a href={METAMASK_URL}>Metamask</a>, use <a href={TRUST_WALLET_URL}>Trust Wallet</a> or use
                        <a href={COINBASE_WALLET_URL}>Coinbase Wallet (Toshi)</a>.
                    </Trans>
                </p>
            </div>
            <div className={Style.entry}>
                <h5>{t("faq.howToBecomeAffiliate.question")}</h5>
                <p>
                    <Trans i18nKey="faq.howToBecomeAffiliate.answer">
                        We have created a short article describing, how to generate referral links. See
                        <a href="https://medium.com/@dicether/how-to-create-a-dicether-affiliate-campaign-705f4be06c54">
                            How to generate a affiliate campaign
                        </a>
                        for a short description.
                    </Trans>
                </p>
            </div>
            <div className={Style.entry}>
                <h5>{t("faq.iFoundABug.question")}</h5>
                <p>
                    <Trans i18nKey="faq.iFoundABug.answer">
                        Please report it to <a href={`mailto:${BUGS_URL}`}>{BUGS_URL}</a>.
                    </Trans>
                </p>
            </div>
            <div className={Style.entry}>
                <h5>{t("faq.contact.question")}</h5>
                <p>
                    <Trans i18nKey="faq.contact.answer">
                        You can mail us: <a href={`mailto:${CONTACT_URL}`}>{CONTACT_URL}</a>.
                    </Trans>
                </p>
            </div>
        </Container>
    </>
);

export default withTranslation()(Faq);
