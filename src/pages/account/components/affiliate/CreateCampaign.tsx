import * as React from "react";
import {Button, Col, Form, FormGroup, Input, Label} from "../../../../reusable";

type Props = {
    onCreateCampaign(id:string, name: string): void;
}

type State = {
    name: string,
    isNameValid?: boolean,

    id: string,
    isIdValid?: boolean
};

class CreateCampaign extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: "",
            id: "",
            isIdValid: undefined,
            isNameValid: undefined
        }
    }

    onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const {onCreateCampaign} = this.props;
        onCreateCampaign(this.state.id, this.state.name);
        e.preventDefault();
    };

    onName = (name: string) => {
        const isNameValid = this.validateName(name);
        this.setState({name, isNameValid});
    };

    onId = (id: string) => {
        const isIdValid = this.validateName(id);
        this.setState({id, isIdValid});
    };

    validateName = (name: string) => {
        if (name.length <= 15 && name.length >= 3 && /^[a-z0-9]+$/i.test(name)) {
            return true
        } else if (name.length === 0){
            return undefined;
        } else {
            return false
        }
    };


    render() {
        const {id, name, isNameValid, isIdValid} = this.state;

        return (
            <div>
                <h3>Create Affiliate Campaign</h3>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup row>
                        <Label for="campaignName" sm={3}>Campaign Name</Label>
                        <Col sm={9}>
                            <Input id="campaignName" isValid={isNameValid} showValidation value={name} placeholder="Name" onValue={this.onName}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="campaignId" sm={3}>Campaign Id</Label>
                        <Col sm={9}>
                            <Input id="campaignId" isValid={isIdValid} showValidation value={id} placeholder="Id" onValue={this.onId}/>
                        </Col>
                    </FormGroup>
                    <Button
                        size="sm"
                        color="primary"
                        type="submit"
                        disabled={isNameValid !== true || isIdValid !== true}
                        onClick={this.onSubmit}
                    >
                        Create Campaign
                    </Button>
                </Form>
            </div>
        );
    }
}

export default CreateCampaign;
