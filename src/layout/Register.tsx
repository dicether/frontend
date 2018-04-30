import * as React from 'react';

import {Button, FormText, Form, FormGroup, Input} from '../reusable/index';


type Props = {
    onRegister(username: string): void;
}

type State = {
    username: string,
    isValid?: boolean
}


export default class Register extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            username: "",
        }
    }

    register = (e: React.FormEvent<HTMLFormElement>) => {
        const {onRegister} = this.props;
        const {username} = this.state;

        onRegister(username);
        e.preventDefault();
    };

    onUsername = (username: string) => {
        const isValid = this.validateUsername(username);
        this.setState({
            username,
            isValid
        })
    };

    validateUsername = (username: string) => {
        if (username.length <= 15 && username.length >= 3 && /^[a-z0-9]+$/i.test(username)) {
            return true
        } else if (username.length === 0){
            return undefined;
        } else {
            return false
        }
    };

    render() {
        const {username, isValid} = this.state;

        return (
            <div>
                <Form onSubmit={this.register}>
                    <FormGroup>
                        <Input isValid={isValid} showValidation value={username} placeholder="Username" onValue={this.onUsername}/>
                        <FormText>You can't change the username after registration! So choose wisely...</FormText>
                    </FormGroup>
                    <Button color="primary" type="submit" disabled={isValid !== true} onClick={this.register}>Register</Button>
                </Form>
            </div>
        )
    }
}
