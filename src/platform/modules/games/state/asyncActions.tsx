import axios from "axios";
import ethUtil from 'ethereumjs-util'


import {Dispatch, GetState, isLocalStorageAvailable} from "../../../../util/util";
import {
    calcPlayerProfit, calcResultNumber, createHashChain, fromBaseToWei, getLastGameId, getServerHash, keccak,
    signBet, verifyBetSignature, verifySeed
} from "../../../../stateChannel";
import {catchError} from "../../utilities/asyncActions";
import {
    acceptedGame, addBet, cancelled, cancelling, cancelTransactionFailure, changeStatus, creatingGame, endBet,
    endedGame, endedWithReason, invalidSeed, rejectedGame, restoreState, transactionFailure, waitingForServer
} from "./actions";
import {CONTRACT_ADDRESS, NETWORK_ID, NETWORK_NAME, SERVER_ADDRESS} from "../../../../config/config";
import {showErrorMessage} from "../../utilities/actions";
import {ReasonEnded, State} from "./reducer";
import {TransactionReceipt} from "../../../../../typings/web3/types";
import {getTransactionReceipt} from "../../web3/asyncActions";
import Web3 from "web3";


const STORAGE_VERSION = 1;


enum ContractStatus {
    ENDED = 0,
    ACTIVE = 1,
    WAITING_FOR_SERVER = 2,
    PLAYER_INITIATED_END = 3,
    SERVER_INITIATED_END = 4,
}

enum ContractReasonEnded {
    REGULAR_ENDED = 0,
    END_FORCED_BY_SERVER = 1,
    END_FORCED_BY_PLAYER = 2,
    REJECTED_BY_SERVER = 3,
    CANCELLED_BY_PLAYER = 4
}


export function loadContractStateCreatedGame() {
    return function (dispatch: Dispatch, getState: GetState) {
        const {web3: web3State, games} = getState();
        const {contract} = web3State;
        const {gameState} = games;
        const {gameId} = gameState;
        const {web3, account} = web3State;

        if (web3 === null || gameId === undefined || account === null) {
            return Promise.resolve();
        }

        return contract.methods.gameIdGame(gameId).call().then(result => {
            const status = Number.parseInt(result.status);
            const reasonEnded = Number.parseInt(result.reasonEnded);

            if (status === ContractStatus.ENDED && gameState.status !== 'ENDED') {
                return dispatch(endedWithReason(ContractReasonEnded[reasonEnded] as ReasonEnded));
            } else if (status === ContractStatus.ACTIVE && gameState.status === 'WAITING_FOR_SERVER') {
                return getServerHash(web3, contract, gameId, account).then(serverHash => {
                    return dispatch(acceptedGame(gameId, serverHash));

                })
            } else if (status === ContractStatus.WAITING_FOR_SERVER && gameState.status === 'CREATING') {
                // can not happen as we wouldn't know game id before WAITING_FOR_SERVER
                return Promise.reject(new Error("Unexpected contract game state WAITING_FOR_SERVER!"));
            } else if (status === ContractStatus.PLAYER_INITIATED_END && gameState.status !== 'ENDED') {
                return dispatch(changeStatus('PLAYER_INITIATED_END'));
            } else if (status === ContractStatus.SERVER_INITIATED_END && gameState.status !== 'ENDED') {
                return dispatch(changeStatus('SERVER_INITIATED_END'));
            } else {
                return Promise.resolve();
            }
        }).catch(error => catchError(error, dispatch));
    }
}

export function loadContractGameState() {
    return function (dispatch: Dispatch, getState: GetState) {
        const {web3: web3State, games} = getState();
        const {contract} = web3State;
        const {gameState} = games;
        const {web3, account} = web3State;

        if (contract === null || web3 === null || account === null) {
            return Promise.resolve();
        }


        const transactionHash = gameState.createTransactionHash;
        if (gameState.status === 'CREATING' && transactionHash !== undefined) {
            return getLastGameId(web3, contract, account, transactionHash).then(gameId => {
                return dispatch(waitingForServer(transactionHash, gameId));
            }).catch(error => catchError(error, dispatch));
        }
        return dispatch(loadContractStateCreatedGame());
    }
}

export function loadServerGameState() {
    return function (dispatch: Dispatch, getState: GetState) {
        if (getState().games.gameState.status === 'ENDED') {
            return Promise.resolve();
        }

        return axios.get('activeGameState').then(result => {
            const data = result.data;
            const status = data.status;
            const gameId = data.gameId;
            const serverHash = data.serverHash;

            const gameState = getState().games.gameState;

            if (gameState.status === 'CREATING' || gameState.status === 'WAITING_FOR_SERVER'
                || gameState.status === 'CANCELLING') {
                if (status === 'ACTIVE') {
                    // TODO: check serverHash
                    dispatch(acceptedGame(gameId, serverHash));
                } else if (status === 'REJECTED_BY_SERVER') {
                    dispatch(rejectedGame());
                }
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

export function syncGameState(address: string) {
    return function (dispatch: Dispatch, getState: GetState) {
        return dispatch(loadLocalGameState(address)).then(() => {
            return dispatch(loadContractGameState())
        }).then(() => {
            return dispatch(loadServerGameState())
        }).catch(console.log);
    }
}

export function storeGameState(address: string, gameState: State) {
    if (!isLocalStorageAvailable()) {
        console.warn("No local storage support! Can not store game state!");
        return;
    }
    localStorage.setItem(`gameState${address}`, JSON.stringify({version: STORAGE_VERSION, gameState}));
}

export function serverRejectGame(gameId: number) {
    return function (dispatch: Dispatch, getState: GetState) {
        const gameState = getState().games.gameState;
        const status = gameState.status;
        if (status !== 'CREATING' || (gameState.gameId !== undefined && gameState.gameId !== gameId)) {
            dispatch(showErrorMessage("Unexpected gameRejected message!"));
            return;
        }

        dispatch(rejectedGame());
    }
}

export function serverAcceptGame(gameId: number, serverHash: string) {
    return function (dispatch: Dispatch, getState: GetState) {
        const {web3: web3State, games} = getState();
        const {contract} = web3State;
        const {web3, account} = web3State;


        const gameState = games.gameState;
        const status = gameState.status;
        if ((status !== 'CREATING' && status !== 'WAITING_FOR_SERVER' && status !== 'CANCELLING')
            || (gameState.gameId !== undefined && gameState.gameId !== gameId)) {
            dispatch(showErrorMessage("Unexpected gameAccepted message!"));
            return undefined;
        }

        if (web3 === null || account === null) {
            // accept server hash without checking
            dispatch(acceptedGame(gameId, serverHash));
            return undefined;
        }

        // check if server hash is valid
        return getServerHash(web3, contract, gameId, account).then(contractServerHash => {
            if (!ethUtil.toBuffer(serverHash).equals(ethUtil.toBuffer(contractServerHash))) {
                dispatch(showErrorMessage(`Invalid server hash! ${serverHash} instead of ${contractServerHash}`));
                return;
            }

            dispatch(acceptedGame(gameId, contractServerHash));
        }).catch(error => {
            // getServerHash failed => accept without checking but show error message
            dispatch(acceptedGame(gameId, serverHash));
            catchError(error, dispatch);
        })
    }
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

export function createGame(value: number, playerSeed: string) {
    return function (dispatch: Dispatch, getState: GetState) {
        const web3State = getState().web3;
        const contract = web3State.contract;
        const account = web3State.account;
        const gameState = getState().games.gameState;
        const status = gameState.status;

        if (!isLocalStorageAvailable()) {
            dispatch(showErrorMessage("You browser doesn't support sessionStorage/localStorage! Without playing is not possible!"));
            return;
        }

        if (!validNetwork(web3State.networkId)) {
            dispatch(showErrorMessage(`Invalid network! You need to use ${NETWORK_NAME}!`));
            return;
        }


        if (account === null || contract === null || web3State.web3 === null
                || (status !== 'ENDED' && (status !== 'CREATING' && gameState.createTransactionHash !== undefined))) {
            dispatch(showErrorMessage("Invalid state! Can not create game!"));
            return;
        }

        if ((web3State.web3.currentProvider as any).isTrust) {
            dispatch(showErrorMessage("Trust wallet is currently not supported!"));
            return;
        }

        const createGame = contract.methods.createGame;
        const hashChain = createHashChain(playerSeed);


        checkIfEndTransactionFinished(web3State.web3, gameState.endTransactionHash).then(finished => {
            // transaction hash is unknown
            if (!finished) {
                dispatch(showErrorMessage("You need to wait until transaction ending game session in mined!"));
                return Promise.resolve();
            }

            dispatch(creatingGame(hashChain, value, undefined));

            return createGame(hashChain[0]).send({from: account, value: fromBaseToWei(value), gas: 180000}).on(error => {
                catchError(error, dispatch);
            }).on('transactionHash', transactionHash => {
                dispatch(creatingGame(hashChain, value, transactionHash));
            }).on('receipt', (receipt: TransactionReceipt) => {
                const event = receipt.events ? receipt.events.LogGameCreated : null;
                if ((Number.parseInt(receipt.status) === 1 || (receipt.status as any) === true) && event !== null) {
                    const gameId = (event.returnValues as any).gameId;
                    dispatch(waitingForServer(receipt.transactionHash, Number.parseInt(gameId)));
                } else {
                    dispatch(showErrorMessage("Create game transaction failed!"));
                    dispatch(transactionFailure());
                }
            }).catch(error => {
                catchError(error, dispatch);
            })
        }).catch(error => {
                catchError(error, dispatch);
        });
    }
}

export function cancelCreateGame() {
    return function (dispatch: Dispatch, getState: GetState) {
        const gameState = getState().games.gameState;
        const web3State = getState().web3;
        const contract = web3State.contract;
        const account = web3State.account;
        const gameId = gameState.gameId;

        if (!validNetwork(web3State.networkId)) {
            dispatch(showErrorMessage(`Invalid network! You need to use ${NETWORK_NAME}!`));
            return;
        }

        if (gameId === undefined || account === null || contract === null || gameState.status !== 'WAITING_FOR_SERVER') {
            dispatch(showErrorMessage("Invalid state! Can not cancel game session creation!"));
            return;
        }

        const cancelGame = contract.methods.cancelGame;
        cancelGame(gameId).send({from: account, value: 0, gas: 120000}).on('transactionHash', hash => {
            dispatch(cancelling());
        }).on(error => {
            catchError(error, dispatch);
            dispatch(cancelTransactionFailure());
        }).then((receipt: TransactionReceipt) => {
            if (Number.parseInt(receipt.status) === 1) {
                dispatch(cancelled());
            } else {
                dispatch(cancelTransactionFailure());
                dispatch(showErrorMessage("Cancelling transaction failed!"));
            }
        }).catch(error => {
            catchError(error, dispatch);
            dispatch(cancelTransactionFailure());
        })
    }
}

export function endGame() {
    return function (dispatch: Dispatch, getState: GetState) {
        const state = getState();
        const gameState = state.games.gameState;
        const account = state.web3.account;
        const web3 = state.web3.web3;

        // use previous seeds as new hashes seeds (hash chain)
        const serverHash = gameState.serverHash;
        const playerHash = gameState.playerHash;


        const serverAddress = SERVER_ADDRESS;
        const playerAddress = account;
        const gameId = gameState.gameId;
        const roundId = gameState.roundId + 1;
        const gameType = 0;
        const num = 0;
        const value = 0;
        const balance = gameState.balance;

        if (playerHash === undefined || serverHash === undefined || web3 === null || playerAddress === null || gameId === undefined) {
            dispatch(showErrorMessage("Invalid state!"));
            return;
        }

        let playerSig = "";
        signBet(web3, playerAddress, roundId, gameType, num, value, balance, serverHash, playerHash, gameId,
            CONTRACT_ADDRESS).then(result => {
            playerSig = result;
            return axios.post('endGame', {
                'roundId': roundId,
                'gameType': gameType,
                'num': num,
                'value': value,
                'balance': balance,
                'serverHash': serverHash,
                'playerHash': playerHash,
                'gameId': gameId,
                'contractAddress': CONTRACT_ADDRESS,
                'playerSig': playerSig
            });
        }).then(response => {
            const serverSig = response.data.serverSig;

            if (!verifyBetSignature(roundId, gameType, num, value, balance, serverHash,
                    playerHash, gameId, CONTRACT_ADDRESS, serverSig, serverAddress)) {
                return Promise.reject(new Error('Invalid server signature!'));
            }

            const endTransactionHash = response.data.transactionHash;

            dispatch(endedGame(roundId, serverHash, playerHash, serverSig, playerSig, endTransactionHash));

            return Promise.resolve();
        }).catch(error => catchError(error, dispatch));
    }
}

export function conflictEnd() {
    return function (dispatch: Dispatch, getState: GetState) {
        const state = getState();
        const gameState = state.games.gameState;
        const account = state.web3.account;
        const web3 = state.web3.web3;
        const contract = state.web3.contract;

        const playerAddress = account;
        const gameId = gameState.gameId;
        const roundId = gameState.roundId;
        const gameType = gameState.gameType;
        const num = gameState.num;
        const oldBalance = gameState.oldBalance;
        const serverSig = gameState.serverSig;
        const contractAddress = contract.options.address;

        if (gameState.serverHash === undefined || gameState.playerHash === undefined || web3 === null || playerAddress === null
            || gameId === undefined || contract == null) {
            dispatch(showErrorMessage("Invalid state!"));
            return;
        }

        if (roundId === 0) {
            const cancelActiveGame = contract.methods.playerCancelActiveGame;
            cancelActiveGame(gameId).send({from: account, value: 0, gas: 120000}).on('transactionHash', hash => {
                // TODO
            }).on(error => {
                catchError(error, dispatch);
            }).then((receipt: TransactionReceipt) => {
                // TODO
            }).catch(error => {
                catchError(error, dispatch);
            })
        } else {
            let serverHash = keccak(gameState.serverHash);
            let playerHash = keccak(gameState.playerHash);
            const value = fromBaseToWei(gameState.betValue as number);
            let balance = fromBaseToWei(oldBalance);
            let playerSeed = gameState.playerHash;

            if (gameState.status === 'PLACED_BET') {
                serverHash = gameState.serverHash;
                playerHash = gameState.playerHash;
                balance = fromBaseToWei(gameState.balance);
                playerSeed = gameState.hashChain[roundId];
            }

            const playerEndGameConflict = contract.methods.playerEndGameConflict;
            playerEndGameConflict(
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
            ).send({from: account, gas: 200000}).on('transactionHash', hash => {
                // TODO
            }).on(error => {
                catchError(error, dispatch);
            }).then((receipt: TransactionReceipt) => {
                // TODO
            }).catch(error => {
                catchError(error, dispatch);
            })
        }
    }
}

export function requestSeed() {
    return function (dispatch: Dispatch, getState: GetState) {
        const gameState = getState().games.gameState;
        const serverHash = gameState.serverHash;


        if ((gameState.status !== 'INVALID_SEED' && gameState.status !== 'PLACED_BET') || serverHash === undefined
            || typeof gameState.betValue === 'undefined') {
            dispatch(showErrorMessage("Invalid game status!"));
            return Promise.resolve();
        }

        const betValue: number = gameState.betValue;
        const playerSeed = gameState.hashChain[gameState.roundId];

        return axios.post('revealSeed', {
            'gameId': gameState.gameId,
            'roundId': gameState.roundId,
            'playerSeed': playerSeed,
        }).then(response => {
            const serverSeed = response.data.serverSeed;
            const newServerBalance = response.data.balance;

            if (!verifySeed(serverSeed, serverHash)) {
                dispatch(invalidSeed());
                return Promise.reject(new Error("Invalid server seed!"));
            }

            const resNum = calcResultNumber(gameState.gameType, serverSeed, playerSeed);
            const playerProfit = calcPlayerProfit(gameState.gameType, gameState.num, betValue, resNum);

            const newPlayerBalance = gameState.balance + playerProfit;

            if (newServerBalance !== newPlayerBalance) {
                return Promise.reject(new Error("Invalid server balance!"));
            }

            return Promise.resolve(dispatch(endBet(serverSeed, playerSeed, newServerBalance)));
        }).catch(error => {
            catchError(error, dispatch);
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
        const playerHash = gameState.playerHash;


        const serverAddress = SERVER_ADDRESS;
        const roundId = gameState.roundId + 1;
        const gameId = gameState.gameId;
        const balance = gameState.balance;
        const stake = gameState.stake;


        if (gameState.status !== 'ACTIVE' || gameId === undefined) {
            dispatch(showErrorMessage("You need to be logged in and have created a game session before placing bets!"));
            return Promise.reject(new Error("Invalid game status!"));
        }

        if (web3 === null || account === null) {
            dispatch(showErrorMessage("Web3 not available!"));
            return Promise.reject(new Error("Web3 not available!"));
        }

        // TODO: Allow value + balance with new contract
        if (betValue > stake) {
            dispatch(showErrorMessage("Invalid bet value: Funds to low!"));
            return Promise.reject(new Error("Invalid bet value: Funds to low!"));
        }


        if (betValue > stake + balance) {
            dispatch(showErrorMessage("Invalid bet value: Funds to low!"));
            return Promise.reject(new Error("Invalid bet value: Funds to low!"));
        }

        if (serverHash === undefined || playerHash === undefined) {
            dispatch(showErrorMessage("Invalid game state!"));
            return Promise.reject(new Error("Invalid game state!"));
        }


        let playerSig = "";
        let playerSeed = "";
        return signBet(web3, account, roundId, gameType, num, betValue, balance, serverHash, playerHash,
            gameId, CONTRACT_ADDRESS).then(result => {
            playerSig = result;
            return axios.post('placeBet', {
                'roundId': roundId,
                'gameType': gameType,
                'num': num,
                'value': betValue,
                'balance': balance,
                'serverHash': serverHash,
                'playerHash': playerHash,
                'gameId': gameId,
                'contractAddress': CONTRACT_ADDRESS,
                'playerSig': playerSig
            });
        }).then(response => {
            const serverSig = response.data.serverSig;

            if (!verifyBetSignature(roundId, gameType, num, betValue, balance, serverHash, playerHash, gameId,
                    CONTRACT_ADDRESS, serverSig, serverAddress)) {
                return Promise.reject(new Error("Error placing bet: Invalid server signature!"));
            }

            dispatch(addBet(roundId, gameType, betValue, num, balance, serverHash, playerHash, serverSig, playerSig));

            playerSeed = gameState.hashChain[roundId];
            return axios.post('revealSeed', {
                'gameId': gameState.gameId,
                'roundId': roundId,
                'playerSeed': playerSeed,
            });
        }).then(response => {
            const serverSeed = response.data.serverSeed;
            const newServerBalance = response.data.balance;

            if (!verifySeed(serverSeed, serverHash)) {
                dispatch(invalidSeed());
                return Promise.reject(new Error("Invalid server seed!"));
            }

            const resNum = calcResultNumber(gameType, serverSeed, playerSeed);
            const playerProfit = calcPlayerProfit(gameType, num, betValue, resNum);
            const newPlayerBalance = balance + playerProfit;

            if (newServerBalance !== newPlayerBalance) {
                return Promise.reject(new Error("Invalid server balance!"));
            }

            dispatch(endBet(serverSeed, playerSeed, newServerBalance));

            return Promise.resolve({num: resNum, won: playerProfit > 0});
        }).catch(error => {
            catchError(error, dispatch);
            return Promise.reject(error);
        });
    }
}
