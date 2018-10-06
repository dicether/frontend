import * as React from "react";
import {FormText as BootstrapFormText} from "reactstrap";

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    children: React.ReactNode;
}

const FormFeedback = ({children, ...rest}: Props) => <BootstrapFormText children={children} {...rest} />;

export default FormFeedback;
