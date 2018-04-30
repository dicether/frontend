import * as React from 'react';
import {Label as BootstrapLabel} from 'reactstrap';

import {BaseType} from "./BaseType";

export interface Props extends BaseType {
    for?: string,
    children: React.ReactNode
}

const Label = ({for: htmlFor, children}: Props) => (
    <BootstrapLabel for={htmlFor} children={children}/>
);

export default Label
