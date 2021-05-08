import ClassNames from "classnames";
import * as React from "react";

import {BaseType} from "./BaseType";

const Style = require("./StaticPopover.scss");

export interface Props extends BaseType {
    placement: "top" | "bottom" | "right" | "left";
    children: React.ReactNode;
    className?: string;
}

const StaticPopover = ({placement, children, className}: Props) => {
    const popoverClassName = ClassNames(
        "popover",
        {"bs-popover-top": placement === "top"},
        {"bs-popover-bottom": placement === "bottom"},
        {"bs-popover-right": placement === "right"},
        {"bs-popover-left": placement === "left"},
        Style.staticPopover,
        className
    );

    const arrowClassName = ClassNames(
        "arrow",
        {[Style.staticPopover__arrow_top]: placement === "bottom"},
        {[Style.staticPopover__arrow_bottom]: placement === "top"},
        {[Style.staticPopover__arrow_right]: placement === "left"},
        {[Style.staticPopover__arrow_left]: placement === "right"}
    );

    return (
        <div className={popoverClassName}>
            <div className={arrowClassName} />
            <div className="popover-body">{children}</div>
        </div>
    );
};

export default StaticPopover;
