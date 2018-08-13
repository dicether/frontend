import * as React from "react";
import {Dropdown as BootstrapDropdown, DropdownMenu, DropdownToggle} from "reactstrap";

import "./Dropdown.scss";

export type Props = {
    button: React.ReactNode,
    children: any
}

type State = {
    isOpen: boolean;
}

class Dropdown extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isOpen: false
        }
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        const {button, children} = this.props;

        return (
            <BootstrapDropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle tag="span" onClick={this.toggle} aria-expanded={this.state.isOpen} data-toggle="dropdown">
                    {button}
                </DropdownToggle>
                <DropdownMenu>
                    {children}
                </DropdownMenu>
            </BootstrapDropdown>
        );
    }
}

export default Dropdown;
