import * as React from "react";
import Overview from "./components/Overview";
import BigFeatures from "./components/BigFeatures";
import SmallFeatures from "./components/SmallFeatures";
import Games from "./components/Games";
import Stats from "../games/components/Stats";
import {Container, Section} from "../../reusable";


const Index = () => (
    <div>
        <Overview/>
        <SmallFeatures/>
        <Games/>
        <Section>
            <Container>
                <Stats />
            </Container>
        </Section>
        <BigFeatures/>
    </div>
);

export default Index;
