import * as React from 'react';
import {Route} from 'react-router-dom'
import {connect} from 'react-redux';

import Dice from './dice/Dice';
import Stats from './components/Stats';
import GameHeader from './components/GameHeader';
import GameFooter from './components/GameFooter'
import {toggleExpertView, toggleHelp, toggleSound} from '../../platform/modules/games/info/actions';
import {State} from '../../rootReducer';
import {Dispatch} from '../../util/util';
import * as asyncStateActions from "../../platform/modules/games/state/asyncActions";
import {bindActionCreators} from "redux";
import {addListeners, removeListeners} from "../../platform/sockets";
import listeners from "../../platform/modules/games/state/socketListeners";
import {Container, Section} from "../../reusable";

const Style = require('./Game.scss');


const mapStateToProps = ({games, web3, account}: State) => {
    const {gameState, info} = games;

    return {
        gameState,
        info,
        web3State: web3,
        loggedIn: account.jwt !== null
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators({
        ...asyncStateActions,
        toggleExpertView,
        toggleHelp,
        toggleSound,
    }, dispatch),
    addStateListeners: () => addListeners(listeners, dispatch),
    removeStateListeners: () => removeListeners(listeners, dispatch)
});


type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;


class Game extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    onAcceptGame = ({gameId, serverHash}: {gameId: number, serverHash: string}) => {
        const {serverAcceptGame} = this.props;
        serverAcceptGame(gameId, serverHash);
    };

    componentWillMount() {
        const {addStateListeners} = this.props;
        addStateListeners()
    }

    componentWillUnmount() {
        const {removeStateListeners} = this.props;
        removeStateListeners();
    }

    createGame = (value: number, seed: string) => {
        const {createGame} = this.props;
        createGame(value, seed);
    };

    endGame = () => {
        const {endGame} = this.props;
        endGame();
    };

    requestSeed = () => {
        const {requestSeed} = this.props;
        requestSeed();
    };

    conflictEnd = () => {
        const {conflictEnd} = this.props;
        conflictEnd();
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
        const {gameState, info, web3State, loggedIn} = this.props;
        const {showHelp, showExpertView, sound} = info;

        return (
            <div>
                <Section gray>
                    <Container>
                        <div className={Style.wrapper}>
                             {loggedIn &&
                                <GameHeader
                                    web3State={web3State}
                                    gameState={gameState}
                                    onStartGame={this.createGame}
                                    onEndGame={this.endGame}
                                    onSeedRequest={this.requestSeed}
                                    onConflictEnd={this.conflictEnd}
                                />
                             }
                            <div className={Style.gameWrapper}>
                                <div className={Style.game}>
                                    <Route exact path="/games/dice" component={Dice}/>
                                </div>
                            </div>
                            <GameFooter
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
                        <Stats showMyBets={loggedIn}/>
                    </Container>
                </Section>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
