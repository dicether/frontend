import * as React from "react";
import DocumentTitle from 'react-document-title';

import Overview from "./components/Overview";
import BigFeatures from "./components/BigFeatures";
import SmallFeatures from "./components/SmallFeatures";
import Games from "./components/Games";
import Stats from "../games/components/Stats";
import {Container, Section} from "../../reusable";


const Index = () => (
    <DocumentTitle title="Dicether">
        <div>
            <Overview/>
            <SmallFeatures/>
            <Games/>
            <Section>
                <Container>
                    <Stats showMyBets={false}/>
                </Container>
            </Section>
            <BigFeatures/>
        </div>
    </DocumentTitle>
);

export default Index;
