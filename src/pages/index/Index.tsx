import * as React from "react";
import DocumentTitle from "react-document-title";

import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import Stats from "../../platform/components/bet/Stats";
import {showRegisterModal} from "../../platform/modules/modals/actions";
import {Container, Section} from "../../reusable";
import {State as RootState} from "../../rootReducer";
import BigFeatures from "./components/BigFeatures";
import Games from "./components/Games";
import Overview from "./components/Overview";
import SmallFeatures from "./components/SmallFeatures";

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            showRegisterModal,
        },
        dispatch
    );

export const mapStateToProps = (state: RootState) => {
    return {
        loggedIn: state.account.jwt !== null,
    };
};

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Index = ({loggedIn, showRegisterModal}: Props) => (
    <DocumentTitle title="Dicether">
        <div>
            <Overview loggedIn={loggedIn} showRegisterModal={showRegisterModal} />
            {!loggedIn && <SmallFeatures />}
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);
