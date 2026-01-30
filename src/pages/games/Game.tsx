import * as React from "react";
import {connect} from "react-redux";
import {Route, RouteProps, Routes} from "react-router-dom";
import {bindActionCreators} from "redux";

import ChooseFrom12 from "./chooseFrom12/ChooseFrom12";
import GameFooter from "./components/GameFooter";
import GameHeader from "./components/GameHeader";
import Dice from "./dice/Dice";
import FlipACoin from "./flipACoin/FlipACoin";
import Keno from "./keno/Keno";
import Plinko from "./plinko/Plinko";
import Wheel from "./wheel/Wheel";
import PathNotFound from "../../app/PathNotFound";
import Stats from "../../platform/components/bet/Stats";
import {toggleExpertView, toggleHelp, toggleSound} from "../../platform/modules/games/info/actions";
import {
    conflictEnd,
    createGame,
    endGame,
    forceEnd,
    manualRequestSeed,
} from "../../platform/modules/games/state/asyncActions";
import listeners from "../../platform/modules/games/state/socketListeners";
import {catchError} from "../../platform/modules/utilities/asyncActions";
import {addListeners, removeListeners} from "../../platform/sockets";
import {Container, Section} from "../../reusable";
import {State} from "../../rootReducer";
import {Dispatch} from "../../util/util";

import * as Style from "./Game.scss";

const mapStateToProps = ({games, account}: State) => {
    const {gameState, info} = games;

    return {
        gameState,
        info,
        loggedIn: account.jwt !== null,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators(
        {
            toggleExpertView,
            toggleHelp,
            toggleSound,
        },
        dispatch,
    ),
    createGame: (value: number, seed: string) => dispatch(createGame(value, seed)),
    endGame: () => dispatch(endGame()),
    manualRequestSeed: () => dispatch(manualRequestSeed()),
    conflictEnd: () => dispatch(conflictEnd()),
    forceEnd: () => dispatch(forceEnd()),
    catchError: (error: Error) => catchError(error, dispatch),
    addStateListeners: () => addListeners(listeners, dispatch),
    removeStateListeners: () => removeListeners(listeners, dispatch),
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteProps;

class Game extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        const {addStateListeners} = this.props;
        addStateListeners();
    }

    componentWillUnmount() {
        const {removeStateListeners} = this.props;
        removeStateListeners();
    }

    createGame = (value: number, seed: string) => {
        const {createGame, catchError} = this.props;
        createGame(value, seed).catch(catchError);
    };

    endGame = () => {
        const {endGame, catchError} = this.props;
        endGame().catch(catchError);
    };

    requestSeed = () => {
        const {manualRequestSeed, catchError} = this.props;
        manualRequestSeed().catch(catchError);
    };

    conflictEnd = () => {
        const {conflictEnd, catchError} = this.props;
        conflictEnd().catch(catchError);
    };

    forceEnd = () => {
        const {forceEnd, catchError} = this.props;
        forceEnd().catch(catchError);
    };

    onToggleHelp = (show: boolean) => {
        const {toggleHelp} = this.props;
        toggleHelp(show);
    };

    onToggleExpertView = (show: boolean) => {
        const {toggleExpertView} = this.props;
        toggleExpertView(show);
    };

    onToggleSound = (enabled: boolean) => {
        const {toggleSound} = this.props;
        toggleSound(enabled);
    };

    render() {
        const {gameState, info, loggedIn} = this.props;
        const {showHelp, showExpertView, sound} = info;

        return (
            <div>
                <Section gray>
                    <Container>
                        <div className={Style.wrapper}>
                            {loggedIn && (
                                <GameHeader
                                    gameState={gameState}
                                    onStartGame={this.createGame}
                                    onEndGame={this.endGame}
                                    onSeedRequest={this.requestSeed}
                                    onForceEnd={this.forceEnd}
                                    onConflictEnd={this.conflictEnd}
                                />
                            )}
                            <div className={Style.gameWrapper}>
                                <Routes>
                                    <Route path="dice" element={<Dice />} />
                                    <Route path="chooseFrom12" element={<ChooseFrom12 />} />
                                    <Route path="flipACoin" element={<FlipACoin />} />
                                    <Route path="keno" element={<Keno />} />
                                    <Route path="wheel" element={<Wheel />} />
                                    <Route path="plinko" element={<Plinko />} />
                                    <Route path="*" element={<PathNotFound />} />
                                </Routes>
                            </div>
                            <GameFooter
                                authenticated={loggedIn}
                                showHelp={showHelp}
                                onToggleHelp={this.onToggleHelp}
                                showExpertView={showExpertView}
                                onToggleExpertView={this.onToggleExpertView}
                                sound={sound}
                                onToggleSound={this.onToggleSound}
                            />
                        </div>
                    </Container>
                </Section>
                <Section>
                    <Container>
                        <Stats showMyBets={loggedIn} />
                    </Container>
                </Section>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
