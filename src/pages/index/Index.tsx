import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import Stats from "../../platform/components/bet/Stats";
import {showRegisterModal} from "../../platform/modules/modals/slice";
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
        dispatch,
    );

export const mapStateToProps = (state: RootState) => {
    return {
        loggedIn: state.account.jwt !== null,
    };
};

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Index = ({loggedIn, showRegisterModal}: Props) => (
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
);

export default connect(mapStateToProps, mapDispatchToProps)(Index);
