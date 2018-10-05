import * as React from "react";
import {Jumbotron} from "reactstrap";
import {Button, Container, Section} from "../../../reusable";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {showRegisterModal} from "../../../platform/components/modals/actions";

const Style = require("./Overview.scss");

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    showRegisterModal
}, dispatch);

const Overview = ({showRegisterModal}) => (
    <div className={Style.overview}>
        <Container>
            <Jumbotron className={Style.jumbotron}>
                <h1> The state channel dice casino</h1>
                <Button color="primary" size="lg" onClick={showRegisterModal}>Join Now</Button>
                <span className={Style.info}>No details required! Login with Metamask or similar!</span>
            </Jumbotron>
        </Container>
    </div>
);

export default connect(null, mapDispatchToProps)(Overview);
