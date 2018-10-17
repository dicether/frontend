import * as React from "react";
import IconButton from "../../../../reusable/IconButton";

const Style = require("./ReverseRollButton.scss");

export type Props = {
    reversed: boolean;
    onClick: React.MouseEventHandler<any>;
};

const ReverseRollButton = ({reversed, onClick}: Props) => (
    <span>
        <IconButton
            buttonClassName={Style.reverseRollButton}
            className={Style.icon}
            color="primary"
            icon="exchange-alt"
            rotation={reversed ? 180 : undefined}
            onClick={onClick}
        />
    </span>
);

export default ReverseRollButton;
