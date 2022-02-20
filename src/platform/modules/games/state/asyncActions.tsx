import {
    Bet,
    calcResultNumber,
    calcUserProfit,
    createHashChain,
    createTypedData,
    fromGweiToWei,
    GameStatus as ContractStatus,
    keccak,
    ReasonEnded as ContractReasonEnded,
    verifySeed,
    verifySignature,
} from "@dicether/state-channel";
import * as Sentry from "@sentry/browser";
import retry from "async-retry";
import axios from "axios";
import Web3 from "web3";

import {TransactionReceipt} from "web3-core";
import {CHAIN_ID, CONTRACT_ADDRESS, NETWORK_NAME, SERVER_ADDRESS, SIGNATURE_VERSION} from "../../../../config/config";
import {getLogGameCreated, getReasonEnded} from "../../../../contractUtils";
import {Dispatch, GetState, isLocalStorageAvailable} from "../../../../util/util";
import {addNewBet} from "../../bets/asyncActions";
import {Bet as FinalBet} from "../../bets/types";
import {catchError} from "../../utilities/asyncActions";
import {getTransactionReceipt, signTypedData} from "../../web3/asyncActions";
import {
    addBet,
    creatingGame,
    endedGame,
    endedWithReason,
    gameCreated,
    restoreState,
    revealSeed,
    serverConflictEnd,
    userAbortConflictEnd,
    userAbortForceEnd,
    userConflictEnd,
    userInitiateConflictEnd,
    userInitiateForceEnd,
} from "./actions";
import {ReasonEnded, State, State as GameState} from "./reducer";

const STORAGE_VERSION = 2;

//
// Event handling
//
function canCreateGame(gameState: GameState) {
    const status = gameState.status;
    return status === "ENDED" || (status === "CREATING" && !gameState.createTransactionHash);
}

function createGameEvent(hashChain: string[], serverEndHash: string, value: number, transactionHash?: string) {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canCreateGame(getState().games.gameState)) {
            dispatch(creatingGame(hashChain, serverEndHash, value, transactionHash));
        } else {
            Sentry.captureMessage("Unexpected createGameEvent");
        }
    };
}

function canEndGame(gameState: GameState) {
    const status = gameState.status;
    return status !== "ENDED";
}

function endGameEvent(reason: ReasonEnded) {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canEndGame(getState().games.gameState)) {
            dispatch(endedWithReason(reason));
        } else {
            Sentry.captureMessage("Unexpected endGameEvent");
        }
    };
}

function canRegularEndGame(gameState: GameState) {
    const status = gameState.status;
    return status === "ACTIVE";
}

export function canUserEndGame(gameState: GameState) {
    const status = gameState.status;
    const reasonEnded = gameState.reasonEnded;

    return status == "ENDED" && reasonEnded == "REGULAR_ENDED";
}

function regularEndGameEvent(
    roundId: number,
    serverHash: string,
    userHash: string,
    serverSig: string,
    userSig: string,
    endTransactionHash: string
) {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canRegularEndGame(getState().games.gameState)) {
            dispatch(endedGame(roundId, serverHash, userHash, serverSig, userSig, endTransactionHash));
        } else {
            Sentry.captureMessage("Unexpected regularEndGameEvent");
        }
    };
}

function canActivateGame(gameState: GameState) {
    const status = gameState.status;
    return status === "CREATING";
}

function activateGameEvent(gameId: number, serverHash: string, userHash: string) {
    return (dispatch: Dispatch, getState: GetState) => {
        const gameState = getState().games.gameState;
        if (canActivateGame(gameState)) {
            if (serverHash !== gameState.serverHash) {
                throw Error(`Unexpectd serverHash: ${serverHash}, expected ${gameState.serverHash}`);
            }
            if (userHash !== gameState.userHash) {
                throw Error(`Unexpectd userHash: ${userHash}, expected ${gameState.userHash}`);
            }

            dispatch(gameCreated(gameId));
        } else {
            Sentry.captureMessage("Unexpected activateGameEvent");
        }
    };
}

function canPlaceBet(gameState: GameState) {
    const status = gameState.status;
    return status === "ACTIVE";
}

function placeBetEvent(bet: Bet, serverSig: string, userSig: string) {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canPlaceBet(getState().games.gameState)) {
            dispatch(addBet(bet, serverSig, userSig));
        } else {
            Sentry.captureMessage("Unexpected placeBetEvent");
        }
    };
}

function canRevealSeed(gameState: GameState) {
    const status = gameState.status;
    return status === "PLACED_BET";
}

function revealSeedEvent(serverSeed: string, userSeed: string, balance: number) {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canRevealSeed(getState().games.gameState)) {
            dispatch(revealSeed(serverSeed, userSeed, balance));
        } else {
            Sentry.captureMessage("Unexpected revealSeedEvent");
        }
    };
}

export function canUserInitiateConflictEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "ACTIVE" || status === "PLACED_BET" || status === "SERVER_CONFLICT_ENDED";
}

function userInitiateConflictEndEvent(transactionHash: string) {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canUserInitiateConflictEnd(getState().games.gameState)) {
            dispatch(userInitiateConflictEnd(transactionHash));
        } else {
            Sentry.captureMessage("Unexpected userInitiateConflictEndEvent");
        }
    };
}

function canUserConflictEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "USER_INITIATED_CONFLICT_END";
}

function userConflictEndEvent(time: Date) {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canUserConflictEnd(getState().games.gameState)) {
            dispatch(userConflictEnd(time));
        } else {
            Sentry.captureMessage("Unexpected userConflictEndEvent");
        }
    };
}

function canUserAbortConflictEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "USER_INITIATED_CONFLICT_END";
}

function userAbortConflictEndEvent() {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canUserAbortConflictEnd(getState().games.gameState)) {
            dispatch(userAbortConflictEnd());
        } else {
            Sentry.captureMessage("Unexpected userAbortConflictEndEvent");
        }
    };
}

function canUserInitiateForceEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "USER_CONFLICT_ENDED";
}

function userInitiateForceEndEvent(transactionHash: string) {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canUserInitiateForceEnd(getState().games.gameState)) {
            dispatch(userInitiateForceEnd(transactionHash));
        } else {
            Sentry.captureMessage("Unexpected userInitiateForceEndEvent");
        }
    };
}

function canUserForceEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "USER_INITIATED_FORCE_END";
}

function userForceEndEvent() {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canUserForceEnd(getState().games.gameState)) {
            dispatch(endedWithReason("END_FORCED_BY_USER"));
        } else {
            Sentry.captureMessage("Unexpected userForceEndEvent");
        }
    };
}

function canUserAbortForceEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "USER_INITIATED_FORCE_END";
}

function userAbortForceEndEvent() {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canUserAbortForceEnd(getState().games.gameState)) {
            dispatch(userAbortForceEnd());
        } else {
            Sentry.captureMessage("Unexpected userAbortForceEndEvent");
        }
    };
}

function canServerConflictEnd(gameState: GameState) {
    const status = gameState.status;
    return (
        status === "CREATING" ||
        status === "USER_CONFLICT_ENDED" ||
        status === "USER_INITIATED_CONFLICT_END" ||
        status === "USER_INITIATED_FORCE_END" ||
        status === "ACTIVE" ||
        status === "PLACED_BET"
    );
}

function serverConflictEndEvent() {
    return (dispatch: Dispatch, getState: GetState) => {
        if (canServerConflictEnd(getState().games.gameState)) {
            dispatch(serverConflictEnd());
        } else {
            Sentry.captureMessage("Unexpected serverConflictEndEvent");
        }
    };
}

//
// util functions
//
function isTransactionFailed(receipt: TransactionReceipt) {
    return !receipt.status;
}

export const validChainId = (chainId: number | null) => {
    return chainId === CHAIN_ID;
};

const checkIfEndTransactionFinished = (web3: Web3, transactionHash?: string) => {
    if (!transactionHash) {
        return Promise.resolve(true);
    }

    return getTransactionReceipt(web3, transactionHash).then((receipt) => receipt !== null);
};

export function loadContractStateCreatedGame() {
    return async (dispatch: Dispatch, getState: GetState) => {
        const {web3: web3State, games} = getState();
        const {contract} = web3State;
        const {gameState} = games;
        const {gameId} = gameState;
        const {web3, account} = web3State;

        if (!web3 || !account) {
            throw new Error("You need a web3 enabled browser (Metamask)!");
        }

        if (gameId === undefined) {
            throw new Error("Invalid game state!");
        }

        const result = await contract.methods.gameIdGame(gameId).call();
        const status = Number.parseInt(result.status, 10);

        if (status === ContractStatus.ENDED && canEndGame(gameState)) {
            const reasonEnded = await getReasonEnded(web3, contract, gameId);
            return dispatch(endGameEvent(ContractReasonEnded[reasonEnded] as ReasonEnded));
        } else if (status === ContractStatus.USER_INITIATED_END && canUserConflictEnd(gameState)) {
            return dispatch(userConflictEndEvent(new Date()));
        } else if (status === ContractStatus.SERVER_INITIATED_END && canServerConflictEnd(gameState)) {
            return dispatch(serverConflictEndEvent());
        } else {
            return;
        }
    };
}

export function loadContractGameState() {
    return async (dispatch: Dispatch, getState: GetState) => {
        const {web3: web3State, games} = getState();
        const {contract} = web3State;
        const {gameState} = games;
        const {web3, account, chainId} = web3State;

        if (!account || !web3 || !contract || chainId === null) {
            throw new Error("You need a web3 enabled browser (Metamask)!");
        }

        if (!validChainId(chainId)) {
            throw new Error(`Invalid network! You need to use ${NETWORK_NAME}!`);
        }

        if (gameState.status === "CREATING") {
            // special case as we don't know gameId to read contract state!
            if (!gameState.serverHash) {
                throw new Error("Invalid game state!");
            }

            const logCreated = await getLogGameCreated(web3, contract, gameState.serverHash);
            if (logCreated) {
                const gameId = logCreated.returnValues.gameId;
                const serverHash = logCreated.returnValues.serverEndHash;
                const userHash = logCreated.returnValues.userEndHash;

                dispatch(activateGameEvent(gameId, serverHash, userHash));
                return dispatch(loadContractStateCreatedGame());
            }

            if (gameState.createTransactionHash) {
                const receipt = await getTransactionReceipt(web3, gameState.createTransactionHash);
                if (!receipt) {
                    // transaction isn't mined
                    return;
                }

                if (isTransactionFailed(receipt)) {
                    return dispatch(endGameEvent("TRANSACTION_FAILURE"));
                }
            }
        } else if (gameState.status !== "ENDED") {
            return dispatch(loadContractStateCreatedGame());
        }
    };
}

// TODO: remove???
export function loadServerGameState() {
    return async (dispatch: Dispatch, getState: GetState) => {
        if (getState().games.gameState.status === "ENDED") {
            return;
        }

        try {
            const {data} = await axios.get("stateChannel/activeGameState");
            const status = data.status;
            const gameId = data.gameId;
            const userHash = data.userHash;

            const gameState = getState().games.gameState;
            if (gameState.status === "CREATING" && status === "ACTIVE" && gameState.userHash === userHash) {
                dispatch(gameCreated(gameId));
            }
        } catch (error: any) {
            if (!error.response || error.response.status !== 404) {
                catchError(error, dispatch);
            }
        }
    };
}

export function loadLocalGameState(address: string) {
    return (dispatch: Dispatch) => {
        if (!isLocalStorageAvailable()) {
            Sentry.captureMessage("No local storage support!");
            console.warn("No local storage support!");
        }

        const storedState = localStorage.getItem(`gameState${address}`);
        if (storedState !== null) {
            const state = JSON.parse(storedState);
            dispatch(restoreState(state.gameState));
        }
    };
}

export function storeGameState(address: string, gameState: State) {
    if (!isLocalStorageAvailable()) {
        Sentry.captureMessage("No local storage support!");
        console.warn("No local storage support! Can not store game state!");
        return;
    }
    localStorage.setItem(`gameState${address}`, JSON.stringify({version: STORAGE_VERSION, gameState}));
}

export function syncGameState(address: string) {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(loadLocalGameState(address));
            await dispatch(loadContractGameState());
            await dispatch(loadServerGameState());
        } catch (error) {
            catchError(error, dispatch);
        }
    };
}

// TODO: improve, check contract state???
export function serverActiveGame(gameId: number, serverHash: string, userHash: string) {
    return (dispatch: Dispatch) => {
        if (status === "ACTIVE") {
            // already active => do nothing
            return;
        }

        dispatch(activateGameEvent(gameId, serverHash, userHash));
    };
}

export function createGame(stake: number, userSeed: string) {
    return async (dispatch: Dispatch, getState: GetState) => {
        const web3State = getState().web3;
        const contract = web3State.contract;
        const account = web3State.account;
        const gameState = getState().games.gameState;
        const status = gameState.status;

        if (!isLocalStorageAvailable()) {
            throw new Error(
                "You browser doesn't support sessionStorage/localStorage! Without playing is not possible!"
            );
        }

        if (!validChainId(web3State.chainId)) {
            throw new Error(`Invalid chain! You need to use ${NETWORK_NAME}!`);
        }

        if (!account || !contract || !web3State.web3) {
            throw new Error("You need a web3 enabled browser (Metamask)!");
        }

        if (!canCreateGame(gameState)) {
            throw new Error(`Invalid game status: ${status}! Can not create game!`);
        }

        const createGame = contract.methods.createGame;
        const hashChain = createHashChain(userSeed);

        const finished = await checkIfEndTransactionFinished(web3State.web3, gameState.endTransactionHash);
        if (!finished) {
            throw new Error("You need to wait until transaction ending game session is mined!");
        }

        const response = await axios.post("stateChannel/createGame");
        const data = response.data;
        const serverEndHash = data.serverEndHash;
        const previousGameId = data.previousGameId;
        const createBefore = data.createBefore;
        const signature = data.signature;

        dispatch(createGameEvent(hashChain, serverEndHash, stake));

        await new Promise<void>((resolve, reject) => {
            createGame(hashChain[0], previousGameId, createBefore, serverEndHash, signature)
                .send({
                    from: account,
                    value: fromGweiToWei(stake).toString(),
                    gas: 150000,
                })
                .on("error", (error: Error) => {
                    reject(error);
                })
                .on("transactionHash", (transactionHash: string) => {
                    dispatch(createGameEvent(hashChain, serverEndHash, stake, transactionHash));
                })
                .on("receipt", (receipt: TransactionReceipt) => {
                    if (isTransactionFailed(receipt)) {
                        dispatch(endGameEvent("TRANSACTION_FAILURE"));
                        reject(new Error("Create game transaction failed!"));
                    }
                })
                .on("confirmation", (num: number, receipt: TransactionReceipt) => {
                    // wait for 3 confirmations
                    if (num === 3) {
                        const event = receipt.events ? receipt.events.LogGameCreated : null;
                        if (isTransactionFailed(receipt) || !event) {
                            dispatch(endGameEvent("TRANSACTION_FAILURE"));
                            reject(new Error("Create game transaction failed!"));
                        } else {
                            const gameId = (event.returnValues as any).gameId;
                            const serverHash = (event.returnValues as any).serverEndHash;
                            const userHash = (event.returnValues as any).userEndHash;
                            if (getState().games.gameState.status !== "ACTIVE") {
                                dispatch(activateGameEvent(gameId, serverHash, userHash));
                            }
                            resolve();
                        }
                    }
                })
                .catch((error: Error) => {
                    reject(error);
                });
        });
    };
}

export function endGame() {
    return async (dispatch: Dispatch, getState: GetState) => {
        const state = getState();
        const gameState = state.games.gameState;
        const account = state.web3.account;
        const web3 = state.web3.web3;
        const chainId = state.web3.chainId;

        // use previous seeds as new hashes seeds (hash chain)
        const serverHash = gameState.serverHash;
        const userHash = gameState.userHash;

        const userAddress = account;
        const gameId = gameState.gameId;
        const roundId = gameState.roundId + 1;
        const balance = gameState.balance;

        if (!getState().account.jwt) {
            throw new Error("You need to login before ending game session!");
        }

        if (!account || !web3) {
            throw new Error("You need a web3 enabled browser (Metamask)!");
        }

        if (!validChainId(chainId)) {
            throw new Error(`Invalid network! You need to use ${NETWORK_NAME}!`);
        }

        if (!canRegularEndGame(gameState)) {
            throw new Error(`Invalid game status ${gameState.status}! Can not end game!`);
        }

        if (!userHash || !serverHash || !userAddress || !gameId) {
            throw new Error("Invalid state!");
        }

        const bet = {
            roundId: gameState.roundId + 1,
            gameType: 0,
            num: 0,
            value: 0,
            balance,
            serverHash,
            userHash,
            gameId,
        };

        const typedData = createTypedData(bet, CHAIN_ID, CONTRACT_ADDRESS, SIGNATURE_VERSION);
        const userSig = await signTypedData(web3, account, typedData);

        const {data} = await axios.post("stateChannel/endGame", {bet, contractAddress: CONTRACT_ADDRESS, userSig});
        const {serverSig, transactionHash: endTransactionHash} = data;

        if (!verifySignature(bet, CHAIN_ID, CONTRACT_ADDRESS, serverSig, SERVER_ADDRESS, SIGNATURE_VERSION)) {
            throw new Error("Invalid server signature!");
        }

        dispatch(regularEndGameEvent(roundId, serverHash, userHash, serverSig, userSig, endTransactionHash));
    };
}

export function userEndGame() {
    return async (dispatch: Dispatch, getState: GetState) => {
        const state = getState();
        const gameState = state.games.gameState;
        const account = state.web3.account;
        const web3 = state.web3.web3;
        const contract = state.web3.contract;
        const chainId = state.web3.chainId;

        if (!web3 || !account || !contract) {
            throw new Error("You need a web3 enabled browser (Metamask)!");
        }

        if (!validChainId(chainId)) {
            throw new Error(`Invalid network! You need to use ${NETWORK_NAME}!`);
        }

        if (!canUserEndGame(gameState)) {
            throw new Error(
                `Invalid game status ${gameState.status}, ${gameState.reasonEnded}! Can not resend end transaction!`
            );
        }

        const roundId = gameState.roundId;
        const balance = gameState.balance;
        const serverHash = gameState.serverHash as string;
        const userHash = gameState.userHash as string;
        const gameId = gameState.gameId as number;
        const serverSig = gameState.serverSig as string;

        const userEndGame = contract.methods.userEndGame;
        await new Promise((resolve, reject) =>
            userEndGame(
                roundId,
                fromGweiToWei(balance).toString(),
                serverHash,
                userHash,
                gameId,
                CONTRACT_ADDRESS,
                serverSig
            )
                .send({from: account, value: 0, gas: 120000})
                .on("transactionHash", (_transactionHash: string) => {
                    // nothing to do
                })
                .on("error", (error: Error) => {
                    reject(error);
                })
                .then((_receipt: TransactionReceipt) => {
                    // nothing to do
                })
                .catch((error: Error) => {
                    reject(error);
                })
        );
    };
}

export function conflictEnd() {
    return async (dispatch: Dispatch, getState: GetState) => {
        const state = getState();
        const gameState = state.games.gameState;
        const account = state.web3.account;
        const web3 = state.web3.web3;
        const contract = state.web3.contract;
        const chainId = state.web3.chainId;

        const gameId = gameState.gameId;
        const roundId = gameState.roundId;
        const gameType = gameState.gameType;
        const num = gameState.num;
        const oldBalance = gameState.oldBalance;
        const serverSig = gameState.serverSig;
        const contractAddress = contract.options.address;

        if (!web3 || !account || !contract) {
            throw new Error("You need a web3 enabled browser (Metamask)!");
        }

        if (!validChainId(chainId)) {
            throw new Error(`Invalid network! You need to use ${NETWORK_NAME}!`);
        }

        if (!canUserInitiateConflictEnd(gameState)) {
            throw new Error(`Invalid game status ${gameState.status}! Can not conflict end!`);
        }

        if (!gameState.serverHash || !gameState.userHash || gameId === undefined) {
            throw new Error("Invalid state!");
        }

        if (roundId === 0) {
            const cancelActiveGame = contract.methods.userCancelActiveGame;
            await new Promise((resolve, reject) =>
                cancelActiveGame(gameId)
                    .send({from: account, value: 0, gas: 120000})
                    .on("transactionHash", (transactionHash: string) => {
                        dispatch(userInitiateConflictEndEvent(transactionHash));
                    })
                    .on("error", (error: Error) => {
                        reject(error);
                    })
                    .then((receipt: TransactionReceipt) => {
                        if (isTransactionFailed(receipt)) {
                            dispatch(userAbortConflictEndEvent());
                        } else {
                            dispatch(userConflictEndEvent(new Date()));
                        }
                    })
                    .catch((error: Error) => {
                        reject(error);
                    })
            );
        } else {
            let serverHash = keccak(gameState.serverHash);
            let userHash = keccak(gameState.userHash);
            const value = fromGweiToWei(gameState.betValue as number).toString();
            let balance = fromGweiToWei(oldBalance).toString();
            let userSeed = gameState.userHash;

            if (gameState.status === "PLACED_BET") {
                serverHash = gameState.serverHash;
                userHash = gameState.userHash;
                balance = fromGweiToWei(gameState.balance).toString();
                userSeed = gameState.hashChain[roundId];
            }

            const userEndGameConflict = contract.methods.userEndGameConflict;
            await new Promise((resolve, reject) =>
                userEndGameConflict(
                    roundId,
                    gameType,
                    num,
                    value,
                    balance,
                    serverHash,
                    userHash,
                    gameId,
                    serverSig,
                    userSeed
                )
                    .send({from: account, gas: 250000})
                    .on("transactionHash", (transactionHash: string) => {
                        dispatch(userInitiateConflictEndEvent(transactionHash));
                    })
                    .on("error", (error: Error) => {
                        reject(error);
                    })
                    .then((receipt: TransactionReceipt) => {
                        if (isTransactionFailed(receipt)) {
                            dispatch(userAbortConflictEnd());
                        } else {
                            dispatch(userConflictEndEvent(new Date()));
                        }
                    })
                    .catch((error: Error) => {
                        reject(error);
                    })
            );
        }
    };
}

export function forceEnd() {
    return async (dispatch: Dispatch, getState: GetState) => {
        const state = getState();
        const gameState = state.games.gameState;
        const account = state.web3.account;
        const contract = state.web3.contract;
        const chainId = state.web3.chainId;

        const gameId = gameState.gameId;

        if (!account || !contract) {
            throw new Error("You need a web3 enabled browser (Metamask)!");
        }

        if (!validChainId(chainId)) {
            throw new Error(`Invalid network! You need to use ${NETWORK_NAME}!`);
        }

        if (!canUserInitiateForceEnd(gameState)) {
            throw new Error(`Invalid game status ${gameState.status}! Can not force end!`);
        }

        const userForceGameEnd = contract.methods.userForceGameEnd;
        await new Promise((resolve, reject) =>
            userForceGameEnd(gameId)
                .send({from: account, value: 0, gas: 120000})
                .on("transactionHash", (transactionHash: string) => {
                    dispatch(userInitiateForceEndEvent(transactionHash));
                })
                .on("error", (error: Error) => {
                    return Promise.reject(error);
                })
                .then((receipt: TransactionReceipt) => {
                    if (isTransactionFailed(receipt)) {
                        dispatch(userAbortForceEndEvent());
                    } else {
                        dispatch(userForceEndEvent());
                    }
                })
                .catch((error: Error) => {
                    reject(error);
                })
        );
    };
}

async function revealSeedRequest(gameId: number, roundId: number, userSeed: string) {
    return retry(
        () => {
            return axios.post("stateChannel/revealSeed", {
                gameId,
                roundId,
                userSeed,
            });
        },
        {retries: 1, minTimeout: 500}
    );
}

export function requestSeed() {
    return async (dispatch: Dispatch, getState: GetState) => {
        const gameState = getState().games.gameState;
        const serverHash = gameState.serverHash;

        if (!getState().account.jwt) {
            throw new Error("You need to login before playing!");
        }

        if (!canRevealSeed(gameState)) {
            throw new Error(`Invalid game status: ${gameState.status}! Can not reveal seed!`);
        }

        const betValue = gameState.betValue;
        const userSeed = gameState.hashChain[gameState.roundId];
        const num = gameState.num;
        const gameType = gameState.gameType;
        const balance = gameState.balance;

        if (betValue === undefined || gameState.gameId === undefined || !serverHash) {
            throw new Error("Invalid game state!");
        }

        const {data} = await revealSeedRequest(gameState.gameId, gameState.roundId, userSeed);
        const {serverSeed, balance: newServerBalance, bet} = data;

        if (!verifySeed(serverSeed, serverHash)) {
            throw new Error("Invalid server seed!");
        }

        const resNum = calcResultNumber(gameType, serverSeed, userSeed, num);
        const userProfit = calcUserProfit(gameType, num, betValue, resNum);
        const newUserBalance = balance + userProfit;

        if (newServerBalance !== newUserBalance) {
            throw new Error(`Invalid server balance! Expected ${newUserBalance} got ${newServerBalance}`);
        }

        dispatch(revealSeedEvent(serverSeed, userSeed, newServerBalance));

        return {
            betNum: bet.num,
            num: resNum,
            won: userProfit > 0,
            userProfit,
            bet,
        };
    };
}

export function manualRequestSeed() {
    return async (dispatch: Dispatch) => {
        const result = await dispatch(requestSeed());
        dispatch(addNewBet(result.bet));
        return result;
    };
}

export function placeBet(num: number, betValue: number, gameType: number) {
    return async (
        dispatch: Dispatch,
        getState: GetState
    ): Promise<{betNum: number; num: number; won: boolean; userProfit: number; bet: FinalBet}> => {
        const gameState = getState().games.gameState;
        const web3State = getState().web3;
        const {account, web3} = web3State;

        // use previous seeds as new hashes seeds (hash chain)
        const serverHash = gameState.serverHash;
        const userHash = gameState.userHash;

        const roundId = gameState.roundId + 1;
        const gameId = gameState.gameId;
        const balance = gameState.balance;
        const stake = gameState.stake;

        if (!getState().account.jwt) {
            throw new Error("You need to login before playing!");
        }

        if (!web3 || !account) {
            throw new Error("You need a web3 enabled browser (Metamask)!");
        }

        if (!validChainId(web3State.chainId)) {
            throw new Error(`Invalid network! You need to use ${NETWORK_NAME}!`);
        }

        if (!canPlaceBet(gameState)) {
            throw new Error(`Invalid game status: ${gameState.status}! Can not place bet!`);
        }

        if (!serverHash || !userHash || gameId === undefined) {
            throw new Error("Invalid game state!");
        }

        if (betValue > stake + balance) {
            throw new Error("Invalid bet value: Funds to low!");
        }

        const bet = {
            roundId,
            gameType,
            num,
            value: betValue,
            balance,
            serverHash,
            userHash,
            gameId,
        };

        const typedData = createTypedData(bet, CHAIN_ID, CONTRACT_ADDRESS, SIGNATURE_VERSION);
        const userSig = await signTypedData(web3, account, typedData);

        const {data: dataPlaceBet} = await axios.post("stateChannel/placeBet", {
            bet,
            contractAddress: CONTRACT_ADDRESS,
            userSig,
        });
        const serverSig = dataPlaceBet.serverSig;

        if (!verifySignature(bet, CHAIN_ID, CONTRACT_ADDRESS, serverSig, SERVER_ADDRESS, SIGNATURE_VERSION)) {
            throw new Error("Error placing bet: Invalid server signature!");
        }

        dispatch(placeBetEvent(bet, serverSig, userSig));

        return dispatch(requestSeed());
    };
}
