import * as React from "react";
import {Button as BootstrapButton} from "reactstrap";

import {BaseType} from "./BaseType";

import "./Button.scss";

export interface Props extends BaseType {
    children: React.ReactNode;
    size?: "lg" | "sm";
    color?: string;
    outline?: boolean;
    active?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<any>;
    block?: boolean;
    variant?: string;
    type?: "button" | "reset" | "submit";
    tag?: React.ReactType;
    to?: string;
}

const Button = ({
    block,
    children,
    size,
    color = "secondary",
    outline = false,
    active,
    disabled = false,
    onClick,
    variant,
    ...rest
}: Props) => (
    <BootstrapButton
        className={variant === "dropdown" ? "dropdown-item" : ""}
        block={block}
        size={size}
        color={color}
        outline={outline}
        active={active}
        disabled={disabled}
        onClick={onClick}
        {...rest}
    >
        {children}
    </BootstrapButton>
);

export default Button;
