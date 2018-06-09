import * as React from 'react';
import DocumentTitle from 'react-document-title';

import {CONTACT_URL, BUGS_URL, METAMASK_URL, NAME, GITHUB_URL} from '../../config/config';
import {Container} from "../../reusable";

const Style = require('./Faq.scss');


const Faq = () => (
    <DocumentTitle title="Faq - Dicether">
        <Container>
            <h2 className={Style.heading}>FAQ</h2>
            <div className={Style.entry}>
                <h5 className={Style.subheading}>What is {NAME}?</h5>
                <p>
                    {NAME} is an Ethereum based dice game. It uses a smart contract based
                    state channel implementation to provide a fast, secure and fair gambling experience.
                </p>
                </div>
            <div className={Style.entry}>
                <h5 className={Style.subheading}>What do you mean by "secure, fair and fast"?</h5>
                <p>
                    When you start a game session we and you, the customer, generate a hash chain and send the last
                    entry to the smart contract. Additional to the hash value, you send your funds for playing, which will be
                    securely locked in the smart contract (we can not access your money). For every round playing dice a previous entry of your and
                    our hash chain is combined and from that the resulting dice roll generated! The result is verified and, if
                    everything is ok, signed by you and us. The next round can start. If you are finished with playing the final result
                    is signed and send to contract, which sends back your funds plus your profit or minus your loss.
                </p>
                <p>
                    So the only interaction with the blockchain is happening during starting and ending the game session.
                    Between you can play as many games as you want. No blockchain interaction is necessary!
                </p>
                <p>
                    {/*The smart contract is verified at Etherscan and can be viewed at <a href={CONTRACT_URL}>Coming soon...</a>.*/}
                    {/*So you can check yourself that everything is working as described.*/}
                    To view the contract source visit our <a href={GITHUB_URL}>github</a> repository.
                </p>
                </div>
            <div className={Style.entry}>
                <h5 className={Style.subheading}>What's the house edge?</h5>
                <p>
                    The House Edge is 1.5%.
                </p>
            </div>
            <div className={Style.entry}>
                <h5 className={Style.subheading}>How to register?</h5>
                <p>
                    To register you only need to set a username. No password is needed as we
                    use <a href={METAMASK_URL}>Metamask</a> for authentication.
                </p>
            </div>
            <div className={Style.entry}>
                <h5 className={Style.subheading}> Why can't I place a bet?</h5>
                <p>
                    To play you need to be logged in and  need to have <a href={METAMASK_URL}>Metamask</a> installed.
                </p>
            </div>
            <div className={Style.entry}>
                <h5>I have found a bug!</h5>
                <p>
                    Please report it to <a href={`mailto:${BUGS_URL}`}>{BUGS_URL}</a>.
                </p>
            </div>
            <div className={Style.entry}>
                <h5 className={Style.subheading}>How can I contact you?</h5>
                <p>
                    You can mail us: <a href={`mailto:${CONTACT_URL}`}>{CONTACT_URL}</a>.
                </p>
            </div>
        </Container>
    </DocumentTitle>
);

export default Faq;
