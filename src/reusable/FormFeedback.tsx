import * as React from "react";
import {FormText as BootstrapFormText} from "reactstrap";

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    children: React.ReactNode;
}

const FormFeedback = ({...rest}: Props) => <BootstrapFormText {...rest} />;

export default FormFeedback;
