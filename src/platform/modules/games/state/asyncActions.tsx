import axios from "axios";
import {
    calcNewBalance,
    calcPlayerProfit,
    calcResultNumber,
    createHashChain,
    createTypedData,
    fromGweiToWei,
    hasWon,
    keccak,
    verifySeed,
    verifySignature
} from "@dicether/state-channel";

import {Dispatch, GetState, isLocalStorageAvailable} from "../../../../util/util";
import {getLogGameCreated, getReasonEnded} from "../../../../contractUtils";
import {catchError} from "../../utilities/asyncActions";
import {
    addBet,
    creatingGame,
    endedGame,
    endedWithReason,
    gameCreated,
    restoreState,
    revealSeed, serverConflictEnd, userAbortConflictEnd, userAbortForceEnd, userConflictEnd,
    userInitiateConflictEnd, userInitiateForceEnd,
} from "./actions";
import {ReasonEnded, State as GameState, State} from "./reducer";
import {
    CHAIN_ID,
    CONTRACT_ADDRESS,
    NETWORK_ID,
    NETWORK_NAME,
    SERVER_ADDRESS,
    SIGNATURE_VERSION
} from "../../../../config/config";
import {showErrorMessage} from "../../utilities/actions";
import {TransactionReceipt} from "../../../../../typings/web3/types";
import {getTransactionReceipt, signTypedData} from "../../web3/asyncActions";
import Web3 from "web3";
import {Bet} from "../../../../../../dicether_state-channel/src/types";

const STORAGE_VERSION = 1;


enum ContractStatus {
    ENDED = 0,
    ACTIVE = 1,
    USER_INITIATED_END = 2,
    SERVER_INITIATED_END = 3,
}

enum ContractReasonEnded {
    REGULAR_ENDED = 0,
    END_FORCED_BY_SERVER = 1,
    END_FORCED_BY_USER = 2,
}



//
// Event handling
//
function canCreateGame(gameState: GameState) {
    const status = gameState.status;
    return status === "ENDED" || (status === "CREATING" && !gameState.createTransactionHash);
}

function createGameEvent(hashChain: Array<string>, serverEndHash: string, value: number, transactionHash?: string) {
    return function (dispatch: Dispatch, getState: GetState) {
        if (canCreateGame(getState().games.gameState)) {
            dispatch(creatingGame(hashChain, serverEndHash, value, transactionHash));
        }
    }
}


function canEndGame(gameState: GameState) {
    const status = gameState.status;
    return status !== "ENDED";
}

function endGameEvent(reason: ReasonEnded) {
    return function(dispatch: Dispatch, getState: GetState) {
        if (canEndGame(getState().games.gameState)) {
            dispatch(endedWithReason(reason));
        }
    }
}


function canRegularEndGame(gameState: GameState) {
    const status = gameState.status;
    return status === "ACTIVE";
}

function regularEndGameEvent(roundId: number, serverHash: string, userHash: string, serverSig: string, userSig: string, endTransactionHash: string) {
    return function(dispatch: Dispatch, getState: GetState) {
        if (canRegularEndGame(getState().games.gameState)) {
            dispatch(endedGame(roundId, serverHash, userHash, serverSig, userSig, endTransactionHash));
        }
    }
}


function canActivateGame(gameState: GameState, serverEndHash?: string) {
    const status = gameState.status;
    return status === "CREATING" && (!serverEndHash || gameState.serverHash === serverEndHash);
}

function activateGameEvent(gameId: number) {
    return function (dispatch: Dispatch, getState: GetState) {
        if (canActivateGame(getState().games.gameState)) {
            dispatch((gameCreated(gameId)));
        }
    }
}


function canPlaceBet(gameState: GameState) {
    const status = gameState.status;
    return status === "ACTIVE";
}

function placeBetEvent(bet: Bet, serverSig: string, userSig: string) {
    return function (dispatch: Dispatch, getState: GetState) {
        if (canPlaceBet(getState().games.gameState)) {
            dispatch(addBet(bet, serverSig, userSig));
        }
    }
}


function canRevealSeed(gameState: GameState) {
    const status = gameState.status;
    return status === "PLACED_BET";
}

function revealSeedEvent(serverSeed: string, userSeed: string, balance: number) {
    return function (dispatch: Dispatch, getState: GetState) {
        if (canRevealSeed(getState().games.gameState)) {
            dispatch(revealSeed(serverSeed, userSeed, balance));
        }
    }
}


function canUserInitiateConflictEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "ACTIVE" || status === "PLACED_BET" || status === "SERVER_CONFLICT_ENDED";
}

function userInitiateConflictEndEvent(transactionHash: string) {
    return function (dispatch: Dispatch, getState: GetState) {
        if (canUserInitiateConflictEnd(getState().games.gameState)) {
            dispatch(userInitiateConflictEnd(transactionHash));
        }
    }
}


function canUserConflictEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "USER_INITIATED_CONFLICT_END";
}

function userConflictEndEvent() {
    return function (dispatch: Dispatch, getState: GetState) {
        if (canUserConflictEnd(getState().games.gameState)) {
            dispatch(userConflictEnd());
        }
    }
}


function canUserAbortConflictEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "USER_INITIATED_CONFLICT_END";
}

function userAbortConflictEndEvent() {
    return function (dispatch: Dispatch, getState: GetState) {
        if (canUserAbortConflictEnd(getState().games.gameState)) {
            dispatch(userAbortConflictEnd());
        }
    }
}


function canUserInitiateForceEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "USER_CONFLICT_ENDED";
}

function userInitiateForceEndEvent(transactionHash: string) {
     return function (dispatch: Dispatch, getState: GetState) {
         if (canUserInitiateForceEnd(getState().games.gameState)) {
            dispatch(userInitiateForceEnd(transactionHash));
         }
     }
}


function canUserAbortForceEnd(gameState: GameState) {
    const status = gameState.status;
    return status === 'USER_INITIATED_FORCE_END';
}

function userAbortForceEndEvent() {
     return function (dispatch: Dispatch, getState: GetState) {
         if (canUserAbortForceEnd(getState().games.gameState)) {
            dispatch(userAbortForceEnd());
         }
     }
}



function canServerConflictEnd(gameState: GameState) {
    const status = gameState.status;
    return status === "CREATING" || status === "USER_CONFLICT_ENDED" || status === "USER_INITIATED_CONFLICT_END"
        || status === "ACTIVE" || status === "PLACED_BET";
}

function serverConflictEndEvent() {
    return function (dispatch: Dispatch, getState: GetState) {
        if (canServerConflictEnd(getState().games.gameState)) {
            dispatch(serverConflictEnd());
        }
    }
}


//
// util functions
//
function isTransactionFailed(receipt: TransactionReceipt) {
    return Number.parseInt(receipt.status) !== 1 && (receipt.status as any) !== true;
}

export const validNetwork = (networkId: number | null) => {
    // only check for null on development
    return (networkId !== null) && (process.env.NODE_ENV === 'development' || networkId === NETWORK_ID);
};

const checkIfEndTransactionFinished = (web3: Web3, transactionHash?: string) => {
    if (!transactionHash) {
        return Promise.resolve(true);
    }

    return getTransactionReceipt(web3, transactionHash).then(receipt =>
        receipt !== null
    )
};


export function loadContractStateCreatedGame() {
    return async function (dispatch: Dispatch, getState: GetState) {
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
        const status = Number.parseInt(result.status);

        if (status === ContractStatus.ENDED && canEndGame(gameState)) {
            const reasonEnded = await getReasonEnded(web3, contract, gameId);
            return dispatch(endGameEvent(ContractReasonEnded[reasonEnded] as ReasonEnded));

        } else if (status === ContractStatus.USER_INITIATED_END && canUserConflictEnd(gameState)) {
            return dispatch(userConflictEndEvent());
        } else if (status === ContractStatus.SERVER_INITIATED_END && canServerConflictEnd(gameState)) {
            return dispatch(serverConflictEndEvent());
        } else {
            return;
        }

    }
}


export function loadContractGameState() {
    return async function (dispatch: Dispatch, getState: GetState) {
        const {web3: web3State, games} = getState();
        const {contract} = web3State;
        const {gameState} = games;
        const {web3, account, networkId} = web3State;

        if (!account || !web3 || !contract || networkId === null) {
            throw new Error("You need a web3 enabled browser (Metamask)!");
        }

        if (!validNetwork(networkId)) {
            throw new Error(`Invalid network! You need to use ${NETWORK_NAME}!`);
        }

        if (gameState.status === 'CREATING') {
            // special case as we don't know gameId to read contract state!
            if (!gameState.serverHash) {
                throw new Error("Invalid game state: serverHash undefined!");
            }
            const logCreated = await getLogGameCreated(web3, contract, gameState.serverHash);
            if (logCreated) {
                dispatch(activateGameEvent(logCreated.returnValues.gameId));
                return dispatch(loadContractStateCreatedGame());
            }
        } else if (gameState.status !== 'ENDED') {
            return dispatch(loadContractStateCreatedGame());
        }
    }
}


// TODO: remove???
export function loadServerGameState() {
    return function (dispatch: Dispatch, getState: GetState) {
        if (getState().games.gameState.status === 'ENDED') {
            return Promise.resolve();
        }

        return axios.get('activeGameState').then(result => {
            const data = result.data;
            const status = data.status;
            const gameId = data.gameId;
            const userHash = data.userHash;

            const gameState = getState().games.gameState;

            if (gameState.status === 'CREATING' && status === 'ACTIVE' && gameState.playerHash === userHash) {
                dispatch(gameCreated(gameId));
            }
        }).catch(error => {
            if (error.response.status !== 404) {
                catchError(error, dispatch);
            }
        });
    }
}

export function loadLocalGameState(address: string) {
    return function (dispatch: Dispatch) {
        if (!isLocalStorageAvailable()) {
            console.warn("No local storage support!");
            return Promise.resolve();
        }

        const storedState = localStorage.getItem(`gameState${address}`);
        if (storedState !== null) {
            const state = JSON.parse(storedState);
            dispatch(restoreState(state.gameState));
        }

        return Promise.resolve();
    }
}

export function storeGameState(address: string, gameState: State) {
    if (!isLocalStorageAvailable()) {
        console.warn("No local storage support! Can not store game state!");
        return;
    }
    localStorage.setItem(`gameState${address}`, JSON.stringify({version: STORAGE_VERSION, gameState}));
}


export function syncGameState(address: string) {
    return function (dispatch: Dispatch, getState: GetState) {
        return dispatch(loadLocalGameState(address)).then(() => {
            // FIXME: // check if web3 is available
            return dispatch(loadContractGameState());
        }).then(() => {
            return dispatch(loadServerGameState());
        }).catch(error => {
            catchError(error, dispatch)
        });
    }
}


// TODO: improve, check contract state???
export function serverActiveGame(gameId: number, serverHash: string) {
    return function (dispatch: Dispatch, getState: GetState) {
        const {games} = getState();

        const gameState = games.gameState;
        const status = gameState.status;
        if (status === 'ACTIVE') {
            // already active => do nothing
            return;
        }

        if (status !== 'CREATING' || gameState.serverHash !== serverHash) {
            dispatch(showErrorMessage("Unexpected gameAccepted message!"));
            return;
        }

        return dispatch(gameCreated(gameId));
    }
}


export function createGame(stake: number, playerSeed: string) {
    return async function (dispatch: Dispatch, getState: GetState) {
        const web3State = getState().web3;
        const contract = web3State.contract;
        const account = web3State.account;
        const gameState = getState().games.gameState;
        const status = gameState.status;

        if (!isLocalStorageAvailable()) {
            return Promise.reject(new Error("You browser doesn't support sessionStorage/localStorage! Without playing is not possible!"));
        }

        if (!validNetwork(web3State.networkId)) {
            return Promise.reject(new Error(`Invalid network! You need to use ${NETWORK_NAME}!`));
        }

        if (!account|| !contract || !web3State.web3) {
            return Promise.reject(new Error("You need a web3 enabled browser (Metamask)!"));
        }

        if (!canCreateGame(gameState)) {
            return Promise.reject(new Error(`Invalid game status: ${status}! Can not create game!`));
        }

        if ((web3State.web3.currentProvider as any).isTrust) {
            return Promise.reject(new Error("Trust wallet is currently not supported!"));
        }

        const createGame = contract.methods.createGame;
        const hashChain = createHashChain(playerSeed);

        try {
             // TODO: Move to canCreateGame???
            const finished = await checkIfEndTransactionFinished(web3State.web3, gameState.endTransactionHash);
            if (!finished) {
                return Promise.reject(new Error("You need to wait until transaction ending game session in mined!"));
            }

            const response = await axios.post('/createGame');
            const data = response.data;
            const serverEndHash = data.serverEndHash;
            const previousGameId = data.previousGameId;
            const createBefore = data.createBefore;
            const signature = data.signature;

            dispatch(createGameEvent(hashChain, serverEndHash, stake, undefined));

            return new Promise ((resolve, reject) => {
                createGame(hashChain[0], previousGameId, createBefore, serverEndHash, signature).send({
                    from: account,
                    value: fromGweiToWei(stake).toString(),
                    gas: 180000
                }).on(error => {
                    reject(error);
                }).on('transactionHash', transactionHash => {
                    dispatch(createGameEvent(hashChain, serverEndHash, stake, transactionHash));
                }).on('receipt', (receipt: TransactionReceipt) => {
                    if (isTransactionFailed(receipt)) {
                        dispatch(endGameEvent("TRANSACTION_FAILURE"));
                        reject(new Error("Create game transaction failed!"));
                    }
                }).on('confirmation', (num: number, receipt: TransactionReceipt) => {
                    // wait for 3 confirmations
                    if (num === 3) {
                        const event = receipt.events ? receipt.events.LogGameCreated : null;
                        if (isTransactionFailed(receipt) || !event) {
                            dispatch(endGameEvent("TRANSACTION_FAILURE"));
                            reject(new Error("Create game transaction failed!"));
                        } else {
                            const gameId = (event.returnValues as any).gameId;
                            dispatch(activateGameEvent(gameId));
                            resolve();
                        }
                    }
                }).catch(error => {
                    reject(error);
                })
            });
        } catch(error) {
            return Promise.reject(error);
        }
    }
}

export function endGame() {
    return function (dispatch: Dispatch, getState: GetState) {
        const state = getState();
        const gameState = state.games.gameState;
        const account = state.web3.account;
        const web3 = state.web3.web3;
        const networkId = state.web3.networkId;

        // use previous seeds as new hashes seeds (hash chain)
        const serverHash = gameState.serverHash;
        const userHash = gameState.playerHash;

        const playerAddress = account;
        const gameId = gameState.gameId;
        const roundId = gameState.roundId + 1;
        const balance = gameState.balance;

        if (!getState().account.jwt) {
            return Promise.reject(new Error("You need to login before ending game session!"));
        }

        if (!account || !web3) {
            return Promise.reject( new Error("You need a web3 enabled browser (Metamask)!"));
        }

        if (!validNetwork(networkId)) {
            return Promise.reject(new Error(`Invalid network! You need to use ${NETWORK_NAME}!`));
        }

        if (!canRegularEndGame(gameState)) {
            return Promise.reject(new Error(`Invalid game status ${gameState.status}! Can not end game!`))
        }

        if (!userHash || !serverHash|| !playerAddress || !gameId) {
            return Promise.reject(new Error("Invalid state!"));
        }

        const bet = {
            roundId: gameState.roundId + 1,
            gameType: 0,
            num: 0,
            value: 0,
            balance,
            serverHash,
            userHash,
            gameId
        };

        let playerSig = "";
        const typedData = createTypedData(bet, CHAIN_ID, CONTRACT_ADDRESS, SIGNATURE_VERSION);
        return signTypedData(web3, account, typedData).then(result => {
            playerSig = result;
            return axios.post('endGame', {
                bet,
                'contractAddress': CONTRACT_ADDRESS,
                'playerSig': playerSig
            });
        }).then(response => {
            const serverSig = response.data.serverSig;

            if (!verifySignature(bet, CHAIN_ID, CONTRACT_ADDRESS,  serverSig, SERVER_ADDRESS, SIGNATURE_VERSION)) {
                return Promise.reject(new Error('Invalid server signature!'));
            }

            const endTransactionHash = response.data.transactionHash;

            dispatch(regularEndGameEvent(roundId, serverHash, userHash, serverSig, playerSig, endTransactionHash));

            return Promise.resolve();
        }).catch(error => Promise.reject(error));
    }
}

export function conflictEnd() {
    return function (dispatch: Dispatch, getState: GetState) {
        const state = getState();
        const gameState = state.games.gameState;
        const account = state.web3.account;
        const web3 = state.web3.web3;
        const contract = state.web3.contract;
        const networkId = state.web3.networkId;

        const gameId = gameState.gameId;
        const roundId = gameState.roundId;
        const gameType = gameState.gameType;
        const num = gameState.num;
        const oldBalance = gameState.oldBalance;
        const serverSig = gameState.serverSig;
        const contractAddress = contract.options.address;

        if (!web3 || !account || !contract) {
            return Promise.reject(new Error("You need a web3 enabled browser (Metamask)!"));
        }

        if (!validNetwork(networkId)) {
            return Promise.reject(new Error(`Invalid network! You need to use ${NETWORK_NAME}!`));
        }

        if (!canUserInitiateConflictEnd(gameState)) {
            return Promise.reject(new Error(`Invalid game status ${gameState.status}! Can not conflict end!`));
        }

        if (!gameState.serverHash|| !gameState.playerHash || gameId === undefined) {
            return Promise.reject(new Error("Invalid state!"));
        }

        if (roundId === 0) {
            const cancelActiveGame = contract.methods.playerCancelActiveGame;
            return cancelActiveGame(gameId).send({from: account, value: 0, gas: 120000}).on('transactionHash', transactionHash => {
                dispatch(userInitiateConflictEndEvent(transactionHash));
            }).on(error => {
                return Promise.reject(error);
            }).then((receipt: TransactionReceipt) => {
                if (isTransactionFailed(receipt)) {
                    dispatch(userAbortConflictEndEvent());
                } else {
                    dispatch(userConflictEndEvent());
                }
            }).catch(error => {
                return Promise.reject(error);
            })
        } else {
            let serverHash = keccak(gameState.serverHash);
            let playerHash = keccak(gameState.playerHash);
            const value = fromGweiToWei(gameState.betValue as number);
            let balance = fromGweiToWei(oldBalance);
            let playerSeed = gameState.playerHash;

            if (gameState.status === 'PLACED_BET') {
                serverHash = gameState.serverHash;
                playerHash = gameState.playerHash;
                balance = fromGweiToWei(gameState.balance);
                playerSeed = gameState.hashChain[roundId];
            }

            const playerEndGameConflict = contract.methods.playerEndGameConflict;
            return playerEndGameConflict(
                roundId,
                gameType,
                num,
                value,
                balance,
                serverHash,
                playerHash,
                gameId,
                contractAddress,
                serverSig,
                playerSeed,
            ).send({from: account, gas: 200000}).on('transactionHash', transactionHash => {
                dispatch(userInitiateConflictEndEvent(transactionHash));
            }).on(error => {
                return Promise.reject(error);
            }).then((receipt: TransactionReceipt) => {
                if (isTransactionFailed(receipt)) {
                    dispatch(userAbortConflictEnd());
                } else {
                    dispatch(userConflictEndEvent());
                }
            }).catch(error => {
                return Promise.reject(error);
            })
        }
    }
}

export function requestSeed() {
    return function (dispatch: Dispatch, getState: GetState) {
        const gameState = getState().games.gameState;
        const serverHash = gameState.serverHash;

        if (!getState().account.jwt) {
            return Promise.reject(new Error("You need to login before playing!"));
        }

        if (!canRevealSeed(gameState)) {
            return Promise.reject(new Error(`Invalid game status: ${gameState.status}! Can not place bet!`));
        }

        const betValue = gameState.betValue;
        const playerSeed = gameState.hashChain[gameState.roundId];

        if (betValue === undefined || serverHash === undefined) {
            return Promise.reject(new Error("Invalid game state!"));
        }

        return axios.post('revealSeed', {
            'gameId': gameState.gameId,
            'roundId': gameState.roundId,
            'playerSeed': playerSeed,
        }).then(response => {
            const serverSeed = response.data.serverSeed;
            const newServerBalance = response.data.balance;

            if (!verifySeed(serverSeed, serverHash)) {
                return Promise.reject(new Error("Invalid server seed!"));
            }

            const newPlayerBalance = calcNewBalance(gameState.gameType, gameState.num, betValue, serverSeed, playerSeed, gameState.balance);

            if (newServerBalance !== newPlayerBalance) {
                return Promise.reject(new Error("Invalid server balance!"));
            }

            return Promise.resolve(dispatch(revealSeedEvent(serverSeed, playerSeed, newServerBalance)));
        }).catch(error => {
            return Promise.reject(error);
        });
    }
}

export function placeBet(num: number, betValue: number, gameType: number) {
    return function (dispatch: Dispatch, getState: GetState) {
        const gameState = getState().games.gameState;
        const web3State = getState().web3;
        const {account, web3} = web3State;

        // use previous seeds as new hashes seeds (hash chain)
        const serverHash = gameState.serverHash;
        const userHash = gameState.playerHash;

        const roundId = gameState.roundId + 1;
        const gameId = gameState.gameId;
        const balance = gameState.balance;
        const stake = gameState.stake;

        if (!getState().account.jwt) {
            return Promise.reject(new Error("You need to login before playing!"));
        }

        if (!web3 || !account) {
            return Promise.reject(new Error("You need a web3 enabled browser (Metamask)!"));
        }

        if (!validNetwork(web3State.networkId)) {
            return Promise.reject(new Error(`Invalid network! You need to use ${NETWORK_NAME}!`));
        }

        if (!canPlaceBet(gameState)) {
            return Promise.reject(new Error(`Invalid game status: ${gameState.status}! Can not place bet!`));
        }

        if (!serverHash || !userHash || gameId === undefined) {
            return Promise.reject(new Error("Invalid game state!"));
        }

        if (betValue > stake + balance) {
            return Promise.reject(new Error("Invalid bet value: Funds to low!"));
        }

        let playerSig = "";
        let playerSeed = "";

        const bet = {
            roundId,
            gameType,
            num,
            value: betValue,
            balance,
            serverHash,
            userHash,
            gameId
        };

        const typedData = createTypedData(bet, CHAIN_ID, CONTRACT_ADDRESS, SIGNATURE_VERSION);

        return signTypedData(web3, account, typedData).then(result => {
            playerSig = result;
            return axios.post('placeBet', {
                bet,
                'contractAddress': CONTRACT_ADDRESS,
                'playerSig': playerSig
            });
        }).then(response => {
            const serverSig = response.data.serverSig;

            if (!verifySignature(bet, CHAIN_ID, CONTRACT_ADDRESS, serverSig, SERVER_ADDRESS, SIGNATURE_VERSION)) {
                return Promise.reject(new Error("Error placing bet: Invalid server signature!"));
            }

            dispatch(placeBetEvent(bet, serverSig, playerSig));

            playerSeed = gameState.hashChain[roundId];
            return axios.post('revealSeed', {
                'gameId': gameState.gameId,
                'roundId': roundId,
                'playerSeed': playerSeed,
            });
        }).then(response => { // TODO: Replace with reveal seed!!!
            const serverSeed = response.data.serverSeed;
            const newServerBalance = response.data.balance;

            if (!verifySeed(serverSeed, serverHash)) {
                return Promise.reject(new Error("Invalid server seed!"));
            }

            const resNum = calcResultNumber(gameType, serverSeed, playerSeed);
            const hashWon = hasWon(gameType, bet.num, resNum);
            const playerProfit = calcPlayerProfit(gameType, num, betValue, hashWon);
            const newPlayerBalance = balance + playerProfit;

            if (newServerBalance !== newPlayerBalance) {
                return Promise.reject(new Error("Invalid server balance!"));
            }

            dispatch(revealSeedEvent(serverSeed, playerSeed, newServerBalance));

            return Promise.resolve({num: resNum, won: playerProfit > 0});
        }).catch(error => {
            return Promise.reject(error);
        });
    }
}
