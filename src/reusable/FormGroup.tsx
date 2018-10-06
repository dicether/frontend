import * as React from "react";
import {FormGroup as BootstrapFormGroup} from "reactstrap";

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    children: React.ReactNode;
    className?: string;
    row?: boolean;
}

const FormGroup = ({children, className, ...rest}: Props) => (
    <BootstrapFormGroup children={children} className={className} {...rest} />
);

export default FormGroup;
