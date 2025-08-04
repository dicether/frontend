import {IconProp} from "@fortawesome/fontawesome-svg-core";
import * as React from "react";

import i18next from "../../../i18n";
import {Col, Container, Row, Section} from "../../../reusable";
import Icon from "../../../reusable/FontAwesomeIcon";

import * as Style from "./SmallFeatures.scss";

const entries: {icon: IconProp; text: string}[] = [
    {
        icon: "balance-scale",
        text: i18next.t("features.secureProvablyFair"),
    },
    {
        icon: "rocket",
        text: i18next.t("features.fastCasino"),
    },
    {
        icon: "user-secret",
        text: i18next.t("features.fullyAnonymous"),
    },
    {
        icon: "gift",
        text: i18next.t("features.recruitUsers"),
    },
    {
        icon: "comments",
        text: i18next.t("features.chatWithUsers"),
    },
    {
        icon: "wallet",
        text: i18next.t("features.supportedWallets"),
    },
];

interface EntryProps {
    text: string;
    icon: IconProp;
}

const Entry = ({text, icon}: EntryProps) => (
    <Col sm={6} className={Style.entry}>
        <Icon size="lg" fixedWidth color="yellow" icon={icon} className={Style.entry__icon} />
        <span>{text}</span>
    </Col>
);

const SmallFeatures = () => (
    <Section className={Style.smallFeatures}>
        <Container>
            <Row>
                {entries.map((entry, idx) => (
                    <Entry key={idx} {...entry} />
                ))}
            </Row>
        </Container>
    </Section>
);

export default SmallFeatures;
