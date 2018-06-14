import * as React from 'react';
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from "react-redux";

import {Button, Form, FormGroup, FormText, Input} from '../../../reusable/index';
import {register, authenticate} from '../../modules/account/asyncActions';
import {BUGS_URL} from "../../../config/config";


const mapDispatchToProps = (dispatch: Dispatch<State>) => bindActionCreators({
    register,
    authenticate
}, dispatch);


type Props = ReturnType<typeof mapDispatchToProps>;


type State = {
    username: string,
    isValid?: boolean
}


class Register extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            username: "",
        }
    }

    register = (e: React.FormEvent<HTMLFormElement>) => {
        const {register} = this.props;
        const {username} = this.state;

        register(username);
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
        const {authenticate} = this.props;
        const {username, isValid} = this.state;

        return (
            <div>
                <h3 className="text-center">Register</h3>
                <Form onSubmit={this.register}>
                    <FormGroup>
                        <Input isValid={isValid} showValidation value={username} placeholder="Username" onValue={this.onUsername}/>
                        <FormText>You can't change the username after registration! So choose wisely...</FormText>
                    </FormGroup>
                    <p>
                        This is the beta version of dicether.com.
                        You can try all features using the ethereum mainet.
                        If you find any bugs, please report it to <a href={`mailto:${BUGS_URL}`}>{BUGS_URL}</a>.
                        <br/>
                        Play responsibly and do not bet what you can not afford to lose.
                        Do not play if you are under 18. Do not play if doing so is illegal in your
                        jurisdiction!
                    </p>
                    <Button color="primary" type="submit" disabled={isValid !== true} onClick={this.register}>Register</Button>
                    <Button color="link" onClick={authenticate}>Already registered</Button>
                </Form>
            </div>
        )
    }
}

export default connect(undefined, mapDispatchToProps)(Register);
