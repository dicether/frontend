import BN from "bn.js";
import ethUtil from "ethereumjs-util";
import Web3 from "web3";
import {TransactionReceipt} from "web3/types";

import {Dispatch, GetState} from "../../../util/util";
import {CONTRACT_ADDRESS, FROM_WEI_TO_BASE} from "../../../config/config";
import {changeAccount, changeBalance, changeContract, changeNetworkId, changeWeb3} from "./actions";

const stateChannelContractAbi =  require('assets/json/GameChannelContract.json');


export function fetchNetwork() {
    return function (dispatch: Dispatch, getState: GetState) {
        const web3 = getState().web3.web3;
        if (web3 !== null) {
            web3.eth.net.getId().then(netId => {
                const networkId = getState().web3.networkId;
                if (networkId !== netId) {
                    dispatch(changeNetworkId(netId));
                }
            }).catch(
                error => console.log("Network id fetching failed: " + error)
            );
        }
    }
}

export function fetchWeb3() {
    return function (dispatch: Dispatch, getState: GetState) {
        const web3Data = getState().web3;
        if (web3Data.web3 === null) {
            if (window.web3 !== undefined) {
                const web3 = new Web3(window.web3.currentProvider);
                const contract = new web3.eth.Contract(stateChannelContractAbi, CONTRACT_ADDRESS);
                dispatch(changeWeb3(web3));
                dispatch(changeContract(contract));
            }
        }
    }
}

export function fetchAccount() {
    return function (dispatch: Dispatch, getState: GetState) {
        const web3 = getState().web3.web3;
        if (web3 !== null) {
            web3.eth.getAccounts().then(accounts => {
                if (accounts.length === 0) {
                    return
                }

                const curAccount = getState().web3.account;
                const account = ethUtil.toChecksumAddress(accounts[0]);
                if (account !== curAccount) {
                    dispatch(changeAccount(account));
                }
            }).catch(
                error => console.log("Account fetching failed: " + error)
            );
        }
    }
}

export function fetchAccountBalance() {
    return function (dispatch: Dispatch, getState: GetState) {
        const web3State = getState().web3;
        const account = web3State.account;
        const web3 = web3State.web3;

        if (web3 !== null && account !== null) {
            web3.eth.getBalance(account).then(result => {
                const balance = new BN(result).div(new BN(FROM_WEI_TO_BASE)).toNumber();
                if (balance !== web3State.balance) {
                    dispatch(changeBalance(balance));
                }
            }).catch(
                error => console.log("Balance fetching failed: " + error)
            );
        }
    }
}

export function fetchAllWeb3() {
    return function (dispatch: Dispatch) {
        dispatch(fetchWeb3());
        dispatch(fetchAccount());
        dispatch(fetchNetwork());
        dispatch(fetchAccountBalance());
    }
}

export function getTransactionReceipt(web3: Web3, transactionHash: string): Promise<TransactionReceipt | null> {
    return web3.eth.getTransactionReceipt(transactionHash);
}

export function signTypedData(web3: Web3, from: string, typedData: any): Promise<string> {
    const params = [typedData, from];
    const method = 'eth_signTypedData';

    return new Promise(function (resolve, reject) {
        (web3.currentProvider as any).sendAsync({
            method,
            params,
            from

        }, (error, result) => {
            if (error) {
                reject(new Error(error));
            } else if (result.error) {
                reject(new Error(result.error.message));
            } else {
                const res: string = result.result;
                resolve(res);
            }
        });
    });
}
