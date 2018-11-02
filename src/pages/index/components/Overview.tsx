import * as React from "react";
import {Jumbotron} from "reactstrap";
import {Button, Container} from "../../../reusable";

const Style = require("./Overview.scss");

export type Props = {
    loggedIn: boolean;
    showRegisterModal(): void;
};

const Overview = ({loggedIn, showRegisterModal}: Props) => (
    <div className={Style.overview}>
        <Container>
            <Jumbotron className={Style.jumbotron}>
                <h1> The state channel dice casino</h1>
                {!loggedIn && (
                    <Button color="primary" size="lg" onClick={showRegisterModal}>
                        Join Now
                    </Button>
                )}
                <span className={Style.info}>No details required! Login with Metamask or similar!</span>
            </Jumbotron>
        </Container>
    </div>
);

export default Overview;
