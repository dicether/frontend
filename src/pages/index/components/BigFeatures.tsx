import * as React from "react";
import ClassNames from 'classnames';

import {Col, Container, Row, Section} from "../../../reusable";

const Style = require("./BigFeatures.scss");

const anonymous = require("assets/images/anonymous.svg");
const fair = require("assets/images/fair.svg");
const fast = require("assets/images/fast.svg");


const entries = [
    {
        img: fair,
        heading: "Provably Fair & Secure",
        text: "We are even more than Provably Fair. You can not only check your results or the results of all other users,"
                + " but, as we are using state channel, we do not have access to you money or can withhold payouts."
    },
    {
        img: fast,
        heading: "Fast",
        text: "We are using state channels You only need to wait a little bit to create a game session."
                + " After the game session is ready ready, playing bets is super fast (under 1 second)."
    },
    {
        img: anonymous,
        heading: "Anonymous",
        text: "Absolutely no details are required. You select a username, sign in with metamask or similar."
                + " No password or email is needed!"
    },
];

const Entry = ({idx, entry}) => {
    const classNameImgCol = ClassNames(
        "text-center mb-4 mb-sm-0",
        {"order-sm-last": idx % 2 === 0}
    );

    return (
    <Row className={Style.entry}>
        < Col md={6} className={classNameImgCol}>
            <img src={entry.img} width={150}/>
        </Col>
        <Col md={6}>
            <h3 className="text-center">{entry.heading}</h3>
            <p>{entry.text}</p>
        </Col>
    </Row>
    );
};


const BigFeatures = () => (
    <Section gray className={Style.features}>
        <Container>
        <h2 className="text-center">Fast, Secure and Fair</h2>
        {
            entries.map((entry, idx) => <Entry entry={entry} idx={idx}/>)
        }
        </Container>
    </Section>
);

export default BigFeatures;
