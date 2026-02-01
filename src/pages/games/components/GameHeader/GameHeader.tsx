import * as React from "react";
import {useRef, useState} from "react";
import Countdown from "react-countdown";
import {useConnection, usePublicClient} from "wagmi";

import CreateGameModal from "./CreateGameModal";
import {
    COINBASE_WALLET_URL,
    GAME_SESSION_TIMEOUT,
    MAX_GAME_SESSION_VALUE,
    METAMASK_URL,
    MIN_GAME_SESSION_VALUE,
    NETWORK_NAME,
    FORCE_END_TIMEOUT,
    TRUST_WALLET_URL,
} from "../../../../config/config";
import {validChainId} from "../../../../platform/modules/games/state/asyncActions";
import {State as GameState} from "../../../../platform/modules/games/state/reducer";
import {Ether, Tooltip, Button, FontAwesomeIcon} from "../../../../reusable";
import {generateSeed} from "../../../../util/crypto";

import * as Style from "./GameHeader.scss";

interface ForceEndRenderProps {
    hours: number;
    minutes: number;
    seconds: number;
    completed: number;
    onForceEnd: () => void;
}

const ForceEndRender = ({hours, minutes, seconds, completed, onForceEnd}: ForceEndRenderProps) => {
    if (completed) {
        return (
            <div>
                <span>The server didn't respond. You can force the game session termination!</span>
                <Button size="sm" onClick={onForceEnd}>
                    Force Termination
                </Button>
            </div>
        );
    } else {
        return (
            <div>
                <span>
                    You created a game session dispute. If the server doesn't respond, you can force the termination of
                    the game session in {hours}:{minutes}:{seconds}.
                </span>
            </div>
        );
    }
};

interface ForceEndProps {
    endTime: Date;
    onForceEnd: () => void;
}

const ForceEnd = ({endTime, onForceEnd}: ForceEndProps) => {
    const sessionTimeout = FORCE_END_TIMEOUT * 3600 * 1000 + new Date(endTime).getTime(); // convert to milliseconds

    return (
        <Countdown
            renderer={(props: any) => <ForceEndRender {...props} onForceEnd={onForceEnd} />}
            date={sessionTimeout}
        />
    );
};

interface Props {
    gameState: GameState;

    onStartGame: (value: number, seed: string) => void;
    onSeedRequest: () => void;
    onEndGame: () => void;
    onConflictEnd: () => void;
    onForceEnd: () => void;
}

const GameHeader = (props: Props) => {
    const endTransactionRef = useRef<HTMLAnchorElement>(null);
    const seed = useRef(generateSeed());
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const onClose = () => {
        setModalIsOpen(false);
    };

    const onShow = () => {
        const {gameState} = props;

        const status = gameState.status;

        // If there is already an active transaction reuse the same seed
        if (status !== "CREATING" || seed.current === null) {
            seed.current = generateSeed();
        }

        setModalIsOpen(true);
    };

    const {gameState, onStartGame, onEndGame, onSeedRequest, onConflictEnd, onForceEnd} = props;

    // special case creating: handle as ended as long as we didn't get transaction hash
    const status = gameState.status;
    const isGameEnded = status === "ENDED" || (status === "CREATING" && !gameState.createTransactionHash);

    const isGameActive = gameState.status === "ACTIVE";
    const isGameCreating = gameState.status === "CREATING" && gameState.createTransactionHash;
    const placedBet = gameState.status === "PLACED_BET";
    const lastGameTransactionHash = gameState.endTransactionHash;
    const serverInitiatedEnd = gameState.status === "SERVER_CONFLICT_ENDED";
    const isUserConflictEnded = gameState.status === "USER_CONFLICT_ENDED";
    const isConflictEnding = gameState.status === "USER_INITIATED_CONFLICT_END";
    const isForceEnding = gameState.status === "USER_INITIATED_FORCE_END";

    // NETWORK_NAME in string literal expression is never as NETWORK_NAME is a constant,
    // so disable the rule which doesn't allow never in string literal expression.
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const transactionUrlNetPrefix = NETWORK_NAME === "Main" ? "" : `${NETWORK_NAME}.`;
    const transactionUrl = `https://${transactionUrlNetPrefix}etherscan.io/tx/${lastGameTransactionHash}`;

    const spinner = <FontAwesomeIcon color="dark" icon="spinner" spin size="lg" />;

    const publicClient = usePublicClient();
    const {status: connectionStatus, chainId} = useConnection();

    if (!publicClient) {
        return (
            <div className={Style.gameHeader}>
                <span className="text-danger">
                    You need a web3 enabled browser for playing (e.g. <a href={METAMASK_URL}>MetaMask</a>,{" "}
                    <a href={TRUST_WALLET_URL}>Trust Wallet</a> or <a href={COINBASE_WALLET_URL}>Coinbase Wallet</a>)
                </span>
            </div>
        );
    } else if (connectionStatus === "connecting" || connectionStatus === "reconnecting") {
        return (
            <div className={Style.gameHeader}>
                <span>Connecting to Wallet... {spinner}</span>
            </div>
        );
    } else if (connectionStatus === "disconnected") {
        return (
            <div className={Style.gameHeader}>
                <span className="text-danger">Please log in to your Wallet!</span>
            </div>
        );
    } else if (!validChainId(chainId)) {
        return (
            <div className={Style.gameHeader}>
                <span className="text-danger">Please select the {NETWORK_NAME} network!</span>
            </div>
        );
    }

    return (
        <div className={Style.gameHeader}>
            {isConflictEnding && <span>Conflict Ending... {spinner}</span>}
            {isForceEnding && <span>Force Ending... {spinner}</span>}
            {isUserConflictEnded && gameState.conflictEndTime && (
                <ForceEnd endTime={gameState.conflictEndTime} onForceEnd={onForceEnd} />
            )}
            {placedBet && (
                <Button size="sm" color="primary" onClick={onSeedRequest}>
                    Request seed!
                </Button>
            )}
            {isGameActive && (
                <Button key="1" size="sm" color="secondary" onClick={onEndGame}>
                    End Game Session
                </Button>
            )}
            {(isGameActive || placedBet) && [
                <div key="1" className={Style.gameHeader__entry}>
                    <span className={Style.gameHeader__entryHeader} key="2">
                        Funds left
                    </span>
                    <Ether gwei={gameState.stake + gameState.balance} />
                </div>,
                <div key="2" className={"hidden-xs-down " + Style.gameHeader__entry}>
                    <span className={Style.gameHeader__entryHeader} key="2">
                        Balance
                    </span>
                    <Ether gwei={gameState.balance} />
                </div>,
            ]}
            {isGameCreating && <span>Creating Game Session... {spinner}</span>}
            {serverInitiatedEnd && (
                <div>
                    <span className="text-danger">
                        Server initiated end! Should only happen if you didn't play for {GAME_SESSION_TIMEOUT} hours!
                    </span>
                    <Button size="sm" onClick={onConflictEnd}>
                        Conflict End
                    </Button>
                </div>
            )}
            {isGameEnded && (
                <div>
                    <Button size="sm" color="primary" onClick={onShow}>
                        Start Game Session
                    </Button>
                    <CreateGameModal
                        seed={seed.current}
                        isOpen={modalIsOpen}
                        minValue={MIN_GAME_SESSION_VALUE}
                        maxValue={MAX_GAME_SESSION_VALUE}
                        onClose={onClose}
                        onCreateGame={onStartGame}
                    />
                    {lastGameTransactionHash !== undefined && [
                        <a
                            key="1"
                            ref={endTransactionRef}
                            rel={"noreferrer"}
                            style={{marginLeft: "1em"}}
                            target="_blank"
                            href={transactionUrl}
                        >
                            End Transaction
                        </a>,
                        <Tooltip key="2" target={() => endTransactionRef.current}>
                            Show last game session end transaction
                        </Tooltip>,
                    ]}
                </div>
            )}
        </div>
    );
};

export default GameHeader;
