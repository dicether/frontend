import * as React from "react";
import {Col, Row} from "../../../reusable";

const anonymous = require("assets/images/anonymous.svg");
const fair = require("assets/images/fair.svg");
const fast = require("assets/images/fast.svg");

const entries = [
    {
        img: fair,
        heading: "",
        text: "",
    },
    {
        img: fast,
        heading: "",
        text: "",
    },
    {
        img: anonymous,
        heading: "",
        text: "",
    },
];

const Entry = ({entry}) => (
    <div>
        <Col md={6}>
            <h2>{entry.heading}</h2>
            <p>{entry.text}</p>
        </Col>
        <Col md={6}>
            <img src={entry.img} />
        </Col>
    </div>
);

const Features = () => (
    <div>
        <Row>
            {entries.map((entry, idx) => (
                <Entry key={idx} entry={entry} />
            ))}
        </Row>
    </div>
);

export default Features;
