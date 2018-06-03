import * as React from "react";
import ClassNames from 'classnames';

import {Col, Container, Row, Section} from "../../../reusable";

const Style = require("./Features.scss");

const anonymous = require("assets/images/anonymous.svg");
const fair = require("assets/images/fair.svg");
const fast = require("assets/images/fast.svg");


const entries = [
    {
        img: fair,
        heading: "Provable Fair",
        text: "Dicether uses the brand new technology, “State channel” to ensure you have full peace of mind whilst playing."
                + "Every bet you make can be verified for its integrity quickly and easily."
    },
    {
        img: fast,
        heading: "Fast",
        text: "Dicether uses the brand new technology, “State channel” to ensure you have full peace of mind whilst playing."
                + "Every bet you make can be verified for its integrity quickly and easily."
    },
    {
        img: anonymous,
        heading: "Anonymous",
        text: "Dicether uses the brand new technology, “State channel” to ensure you have full peace of mind whilst playing."
                + "Every bet you make can be verified for its integrity quickly and easily."
    },
];

const Entry = ({idx, entry}) => {
    const classNameImgCol = ClassNames(
        "text-center", {"order-first": idx % 2 === 1}
    );

    return (
    <Row className={Style.entry}>
        <Col md={6}>
            <h3 className="text-center">{entry.heading}</h3>
            <p>{entry.text}</p>
        </Col>
        < Col md={6} className={classNameImgCol}>
            <img src={entry.img} width={150}/>
        </Col>
    </Row>
    );
};


const Features = () => (
    <Section gray className={Style.features}>
        <Container>
        <h2 className="text-center">Fast, Secure and Fair</h2>
        {
            entries.map((entry, idx) => <Entry entry={entry} idx={idx}/>)
        }
        </Container>
    </Section>
);

export default Features;
