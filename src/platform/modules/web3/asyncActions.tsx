import {hashTypedData, recoverTypedData} from "@dicether/eip712";
import BN from "bn.js";
import ethUtil from "ethereumjs-util";
import Raven from "raven-js";
import Web3 from "web3";
import {TransactionReceipt} from "web3/types"; // tslint:disable-line:no-submodule-imports

import {CONTRACT_ADDRESS, FROM_WEI_TO_BASE} from "../../../config/config";
import {Dispatch, GetState} from "../../../util/util";
import {changeAccount, changeBalance, changeContract, changeNetworkId, changeWeb3} from "./actions";

const stateChannelContractAbi = require("assets/json/GameChannelContract.json");

export function fetchNetwork() {
    return (dispatch: Dispatch, getState: GetState) => {
        const web3 = getState().web3.web3;
        const networkId = getState().web3.networkId;
        if (web3 !== null) {
            web3.eth.net
                .getId()
                .then(netId => {
                    const networkId = getState().web3.networkId;
                    if (networkId !== netId) {
                        dispatch(changeNetworkId(netId));
                    }
                })
                .catch(error => console.log("Network id fetching failed: " + error));
        } else if (networkId !== null) {
            dispatch(changeNetworkId(null));
        }
    };
}

export function fetchWeb3() {
    return (dispatch: Dispatch, getState: GetState) => {
        const web3Data = getState().web3;
        if ((window.web3 || window.ethereum) && web3Data.web3 === null) {
            const web3 = new Web3(window.ethereum ? window.ethereum : window.web3.currentProvider);
            const contract = new web3.eth.Contract(stateChannelContractAbi, CONTRACT_ADDRESS);
            dispatch(changeWeb3(web3));
            dispatch(changeContract(contract));
        } else if (window.web3 === undefined && web3Data.web3 !== null) {
            dispatch(changeWeb3(null));
        }
    };
}

export function fetchAccount() {
    return async (dispatch: Dispatch, getState: GetState) => {
        const web3 = getState().web3.web3;
        const curAccount = getState().web3.account;
        if (web3 !== null) {
            return web3.eth
                .getAccounts()
                .then(accounts => {
                    if (accounts.length === 0) {
                        if (curAccount !== null) {
                            dispatch(changeAccount(null));
                        }
                        return;
                    }

                    const account = ethUtil.toChecksumAddress(accounts[0]);
                    if (account !== curAccount) {
                        dispatch(changeAccount(account));
                    }
                })
                .catch(error => console.log("Account fetching failed: " + error));
        } else if (curAccount !== null) {
            dispatch(changeAccount(null));
        }
    };
}

export function fetchAccountBalance() {
    return (dispatch: Dispatch, getState: GetState) => {
        const web3State = getState().web3;
        const account = web3State.account;
        const web3 = web3State.web3;

        if (web3 !== null && account !== null) {
            web3.eth
                .getBalance(account)
                .then(result => {
                    const balance = new BN(result).div(new BN(FROM_WEI_TO_BASE)).toNumber();
                    if (balance !== web3State.balance) {
                        dispatch(changeBalance(balance));
                    }
                })
                .catch(error => console.log("Balance fetching failed: " + error));
        } else if (web3State.balance !== null) {
            dispatch(changeBalance(null));
        }
    };
}

export function fetchAllWeb3() {
    return (dispatch: Dispatch) => {
        dispatch(fetchWeb3());
        dispatch(fetchAccount());
        dispatch(fetchNetwork());
        dispatch(fetchAccountBalance());
    };
}

export function getTransactionReceipt(web3: Web3, transactionHash: string): Promise<TransactionReceipt | null> {
    return web3.eth.getTransactionReceipt(transactionHash);
}

export async function requestAccounts(dispatch: Dispatch) {
    try {
        await (window as any).ethereum.enable();
        await dispatch(fetchAccount());
    } catch (error) {
        console.log(error.message);
    }
}

export async function signTypedData(web3: Web3, from: string, typedData: any): Promise<string> {
    if ((web3.currentProvider as any).isToshi) {
        const typedDataHash = ethUtil.bufferToHex(hashTypedData(typedData));
        const sig = await web3.eth.sign(typedDataHash, from);
        const recoveredAddress = recoverTypedData(typedData, sig);
        if (recoveredAddress !== from) {
            Raven.captureMessage(
                `Invalid sig ${sig} of hash ${typedDataHash} of data ${JSON.stringify(
                    typedData
                )} recovered ${recoveredAddress} instead of ${from}.`
            );
        }
        return sig;
    } else {
        const params = [from, JSON.stringify(typedData)];
        const method = "eth_signTypedData_v3";

        const sig = await new Promise<string>((resolve, reject) => {
            (web3.currentProvider as any).sendAsync(
                {
                    method,
                    params,
                    from,
                },
                (error: Error, result: {error?: {message: string}; result: string}) => {
                    if (error) {
                        reject(error);
                    } else if (result.error) {
                        reject(new Error(result.error.message));
                    } else {
                        const res: string = result.result;
                        resolve(res);
                    }
                }
            );
        });

        const recoveredAddress = recoverTypedData(typedData, sig);
        if (recoveredAddress !== from) {
            Raven.captureMessage(
                `Invalid sig ${sig} of data ${JSON.stringify(
                    typedData
                )} recovered ${recoveredAddress} instead of ${from}.`
            );
        }
        return sig;
    }
}
