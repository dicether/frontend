import * as React from "react";
import {Col, Container, Row, Section} from "../../../reusable";
import Icon from "../../../reusable/FontAwesomeIcon";

const Style = require("./SmallFeatures.scss");

const Entry = ({text, icon}) => (
  <Col sm={6} className={Style.entry}>
      <Icon size="lg" fixedWidth color="yellow" icon={icon} className={Style.entry__icon}/>
      <span>{text}</span>
  </Col>
);

const entries = [
    {
        icon: "balance-scale",
        text: "Secure & Provable Fair!"
    },
    {
        icon: "rocket",
        text: "Fastest State Channel Dice Casino!"
    },
    {
        icon: "user-secret",
        text: "Fully Anonymous! No personal details required! Login with ethereum wallet. No Password needed!"
    },
    {
        icon: "gift",
        text: "Recruit Users! Get 10% of their house edge!"
    },
    {
        icon: "comments",
        text: "Chat with other users or your friends!"
    },
    {
        icon: "wallet",
        text: "Use MetaMak, Trust Wallet or Coinbase Wallet (Toshi)!"
    }
];

const SmallFeatures = () => (
    <Section className={Style.smallFeatures}>
        <Container>
            <Row>
            {entries.map((entry, idx) =>
                <Entry key={idx} {...entry}/>
            )}
            </Row>
        </Container>
    </Section>
);

export default SmallFeatures;
