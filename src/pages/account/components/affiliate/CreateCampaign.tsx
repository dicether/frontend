import * as React from "react";
import {WithNamespaces, withNamespaces} from "react-i18next";

import {Button, Col, Form, FormGroup, Input, Label} from "../../../../reusable";

export interface Props extends WithNamespaces {
    onCreateCampaign(id: string, name: string): void;
}

type State = {
    name: string;
    isNameValid?: boolean;

    id: string;
    isIdValid?: boolean;
};

class CreateCampaign extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: "",
            id: "",
            isIdValid: undefined,
            isNameValid: undefined,
        };
    }

    private onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const {onCreateCampaign} = this.props;
        onCreateCampaign(this.state.id, this.state.name);
        e.preventDefault();
    }

    private onName = (name: string) => {
        const isNameValid = this.validateName(name);
        this.setState({name, isNameValid});
    }

    private onId = (id: string) => {
        const isIdValid = this.validateName(id);
        this.setState({id, isIdValid});
    }

    private validateName = (name: string) => {
        if (name.length <= 15 && name.length >= 3 && /^[a-z0-9]+$/i.test(name)) {
            return true;
        } else if (name.length === 0) {
            return undefined;
        } else {
            return false;
        }
    }

    render() {
        const {t} = this.props;
        const {id, name, isNameValid, isIdValid} = this.state;

        return (
            <div>
                <h3>Create Affiliate Campaign</h3>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup row>
                        <Label for="campaignName" sm={3}>
                            Campaign Name
                        </Label>
                        <Col sm={9}>
                            <Input
                                id="campaignName"
                                isValid={isNameValid}
                                showValidation
                                value={name}
                                placeholder="e.g. myCampaign"
                                onValue={this.onName}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="campaignId" sm={3}>
                            Campaign Id
                        </Label>
                        <Col sm={9}>
                            <Input
                                id="campaignId"
                                isValid={isIdValid}
                                showValidation
                                value={id}
                                placeholder="e.g. camp123"
                                onValue={this.onId}
                            />
                        </Col>
                    </FormGroup>
                    <Button
                        size="sm"
                        color="primary"
                        type="submit"
                        disabled={isNameValid !== true || isIdValid !== true}
                        onClick={this.onSubmit}
                    >
                        {t("CreateCampaign")}
                    </Button>
                </Form>
            </div>
        );
    }
}

export default withNamespaces()(CreateCampaign);
