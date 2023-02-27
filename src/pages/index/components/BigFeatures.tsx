import ClassNames from "classnames";
import * as React from "react";

import i8n from "../../../i18n";
import {Col, Container, Row, Section} from "../../../reusable";

import Style from "./BigFeatures.scss";

const anonymous = require("assets/images/anonymous.svg");
const fair = require("assets/images/fair.svg");
const fast = require("assets/images/fast.svg");

const entries = [
    {
        img: fair,
        heading: i8n.t("bigFeatures.fair.shortDescription"),
        text: i8n.t("bigFeatures.fair.longDescription"),
    },
    {
        img: fast,
        heading: i8n.t("bigFeatures.fast.shortDescription"),
        text: i8n.t("bigFeatures.fast.longDescription"),
    },
    {
        img: anonymous,
        heading: i8n.t("bigFeatures.anonymous.shortDescription"),
        text: i8n.t("bigFeatures.anonymous.longDescription"),
    },
];

type EntryProps = {
    idx: number;
    entry: (typeof entries)[0];
};

const Entry = ({idx, entry}: EntryProps) => {
    const classNameImgCol = ClassNames("text-center mb-4 mb-sm-0", {"order-sm-last": idx % 2 === 0});

    return (
        <Row className={Style.entry}>
            <Col md={6} className={classNameImgCol}>
                <img src={entry.img} width={150} />
            </Col>
            <Col md={6}>
                <h3 className="text-center">{entry.heading}</h3>
                <p>{entry.text}</p>
            </Col>
        </Row>
    );
};

const BigFeatures = () => (
    <Section className={Style.features}>
        <Container>
            <h2 className="text-center">Fast, Secure and Fair</h2>
            {entries.map((entry, idx) => (
                <Entry key={idx} entry={entry} idx={idx} />
            ))}
        </Container>
    </Section>
);

export default BigFeatures;
