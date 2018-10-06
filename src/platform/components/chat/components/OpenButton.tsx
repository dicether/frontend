import * as React from "react";
import {Button, FontAwesomeIcon} from "../../../../reusable/index";

const Style = require("./OpenButton.scss");

type Props = {
    onOpen(): void;
};

const OpenButton = ({onOpen}: Props) => (
    <Button color="primary" className={Style.openButton + " d-none d-md-block"} onClick={onOpen}>
        <FontAwesomeIcon icon="comments" /> Open Chat
    </Button>
);

export default OpenButton;
