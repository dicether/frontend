import * as React from 'react';

import {State as GameState} from '../../../../platform/modules/games/state/reducer';
import {Ether} from '../../../../reusable';
import CreateGameModal from './CreateGameModal';
import {MIN_GAME_SESSION_VALUE, MAX_GAME_SESSION_VALUE, NETWORK_NAME, SESSION_TIMEOUT} from '../../../../config/config';
import {Button, FontAwesomeIcon} from '../../../../reusable/index';
import {State as Web3State} from '../../../../platform/modules/web3/reducer';

const Style = require('./GameHeader.scss');

type Props = {
    gameState: GameState,
    web3State: Web3State,

    onStartGame(value: number, seed: string): void,
    onSeedRequest(): void,
    onEndGame(): void,
    onConflictEnd(): void,
}

type State = {
    modalIsOpen: boolean
}


export default class GameHeader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            modalIsOpen: false
        }
    }

    onClose = () => {
        this.setState({modalIsOpen: false});
    };

    onShow = () => {
        this.setState({modalIsOpen: true});

    };


    render() {
        const {gameState, onStartGame, onEndGame, web3State, onSeedRequest, onConflictEnd} = this.props;
        const {modalIsOpen} = this.state;

        // special case creating: handle as ended as long as we didn't get transaction hash
        const isGameEnded = gameState.status === 'ENDED' || (gameState.status === 'CREATING' && !gameState.createTransactionHash);

        const isGameActive = gameState.status === 'ACTIVE';
        const isGameCreating = gameState.status === 'CREATING' && gameState.createTransactionHash;
        const isSeedInvalid = gameState.status === 'INVALID_SEED';
        const placedBet = gameState.status === 'PLACED_BET';
        const lastGameTransactionHash = gameState.endTransactionHash;
        const serverInitiatedEnd = gameState.status === 'SERVER_INITIATED_END';
        // const playerInitiatedEnd = gameState.status === 'SERVER_INITIATED_END';

        const transactionUrlNetPrefix = NETWORK_NAME === 'Main' ? '' : `${NETWORK_NAME}.`;
        const transactionUrl = `https://${transactionUrlNetPrefix}etherscan.io/tx/${lastGameTransactionHash}`;

        const spinner = <FontAwesomeIcon color="dark" icon="spinner" spin size="lg"/>;

        return (
            <div className={Style.gameHeader}>
                {(isSeedInvalid || placedBet) &&
                    <Button size="sm" color="primary" onClick={onSeedRequest}>Request seed!</Button>
                }
                {(isGameActive || isSeedInvalid || placedBet) && [
                    <Button key="1" size="sm" color="secondary" onClick={onEndGame}>End Game Session</Button>,
                    <div key="2" className={Style.gameHeader__entry}>
                        <span className={Style.gameHeader__entryHeader} key="2">Funds left</span>
                        <Ether gwei={gameState.stake + gameState.balance}/>
                    </div>,
                    <div key="3" className={Style.gameHeader__entry}>
                        <span className={Style.gameHeader__entryHeader} key="2">Balance</span>
                        <Ether gwei={gameState.balance}/>
                    </div>
                ]}
                {isGameCreating &&
                    <span>Creating Game Session... {spinner}</span>
                }
                { serverInitiatedEnd &&
                    <div>
                        <span className="text-danger">Server initiated end! Should only happen if you didn't play for {SESSION_TIMEOUT} hours!</span>
                        <Button size="sm" onClick={onConflictEnd}>Conflict End</Button>
                    </div>
                }
                {isGameEnded &&
                    <div>
                        <Button size="sm" color="primary" onClick={this.onShow}>Start Game Session</Button>
                        <CreateGameModal
                            isOpen={modalIsOpen}
                            minValue={MIN_GAME_SESSION_VALUE}
                            maxValue={MAX_GAME_SESSION_VALUE}
                            onClose={this.onClose}
                            onCreateGame={onStartGame}
                            web3State={web3State}
                        />
                        {lastGameTransactionHash !== undefined &&
                            <a
                                style={{marginLeft: '1em'}}
                                target="_blank"
                                href={transactionUrl}>
                                Last Game Session Transaction
                            </a>
                        }
                    </div>
                }
            </div>
        );
    }
};
