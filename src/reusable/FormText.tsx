import * as React from "react";
import {FormText as BootstrapFormText} from "reactstrap";
import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    children: React.ReactNode;
    inline?: boolean;
    color?: string;
}

const FormText = ({inline = false, color, ...rest}: Props) => (
    <BootstrapFormText inline={inline} color={color} {...rest} />
);

export default FormText;
