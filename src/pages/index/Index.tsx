import * as React from "react";
import DocumentTitle from "react-document-title";

import Stats from "../../platform/components/bet/Stats";
import {Container, Section} from "../../reusable";
import BigFeatures from "./components/BigFeatures";
import Games from "./components/Games";
import Overview from "./components/Overview";
import SmallFeatures from "./components/SmallFeatures";

const Index = () => (
    <DocumentTitle title="Dicether">
        <div>
            <Overview />
            <SmallFeatures />
            <Games />
            <Section>
                <Container>
                    <Stats showMyBets={false} />
                </Container>
            </Section>
            <BigFeatures />
        </div>
    </DocumentTitle>
);

export default Index;
