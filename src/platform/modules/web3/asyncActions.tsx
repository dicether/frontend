import {recoverTypedData} from "@dicether/eip712";
import * as Sentry from "@sentry/browser";
import BN from "bn.js";
import {toChecksumAddress} from "ethereumjs-util";
import Web3 from "web3";
import {AbstractProvider, TransactionReceipt} from "web3-core";

import {CONTRACT_ADDRESS, FROM_WEI_TO_BASE} from "../../../config/config";
import {Dispatch, GetState} from "../../../util/util";
import {changeAccount, changeBalance, changeContract, changeChainId, changeWeb3} from "./actions";

const stateChannelContractAbi = require("assets/json/GameChannelContract.json");

export function fetchChainId() {
    return async (dispatch: Dispatch, getState: GetState) => {
        const chainId = getState().web3.chainId;
        if (window.ethereum !== null) {
            try {
                const newChainId = parseInt(await window.ethereum.request({method: "eth_chainId", params: []}));
                if (newChainId !== chainId) {
                    dispatch(changeChainId(newChainId));
                }
            } catch (ex) {
                console.log("Chain id fetching failed: " + ex);
            }
        }
    };
}

export function fetchWeb3() {
    return (dispatch: Dispatch, getState: GetState) => {
        const web3Data = getState().web3;
        if (window.ethereum && web3Data.web3 === null) {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(stateChannelContractAbi, CONTRACT_ADDRESS);
            dispatch(changeWeb3(web3));
            dispatch(changeContract(contract));
        } else if (window.ethereum === undefined) {
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
                .then((accounts) => {
                    if (accounts.length === 0) {
                        if (curAccount !== null) {
                            dispatch(changeAccount(null));
                        }
                        return;
                    }

                    const account = toChecksumAddress(accounts[0]);
                    if (account !== curAccount) {
                        dispatch(changeAccount(account));
                    }
                })
                .catch((error) => console.log("Account fetching failed: " + error));
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
                .then((result) => {
                    const balance = new BN(result).div(new BN(FROM_WEI_TO_BASE)).toNumber();
                    if (balance !== web3State.balance) {
                        dispatch(changeBalance(balance));
                    }
                })
                .catch((error) => console.log("Balance fetching failed: " + error));
        } else if (web3State.balance !== null) {
            dispatch(changeBalance(null));
        }
    };
}

export function registerAccountChainIdListener() {
    return (dispatch: Dispatch) => {
        if (window.ethereum === undefined) return;

        window.ethereum.on("accountsChanged", (accounts: string[]) => {
            if (accounts.length === 0) {
                dispatch(changeAccount(null));
            } else {
                const account = toChecksumAddress(accounts[0]);
                dispatch(changeAccount(account));
            }
        });

        window.ethereum.on("chainChanged", (chainId: string) => {
            dispatch(changeChainId(parseInt(chainId)));
        });
    };
}

export function unregisterAccounChainIdListener() {
    window.ethereum.removeListener("accountsChanged");
    window.ethereum.removeListener("chainChanged");
}

export function fetchAllWeb3() {
    return (dispatch: Dispatch) => {
        dispatch(fetchWeb3());
        dispatch(fetchAccount());
        dispatch(fetchChainId());
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
    } catch (error: any) {
        console.log(error.message);
    }
}

export async function signTypedData(web3: Web3, from: string, typedData: any): Promise<string> {
    const provider: AbstractProvider = web3.currentProvider as AbstractProvider;

    // Use v4 for MetaMask as Ledger Nano used with MataMask supports only version 4
    const isMetaMask = (provider as any).isMetaMask !== undefined;
    const method = `eth_signTypedData_v${isMetaMask ? 4 : 3}`;
    const params = [from, JSON.stringify(typedData)];

    if (!provider.request) return Promise.reject("provider.request undefined!");

    const sig = await provider.request({
        method,
        params,
    });

    const recoveredAddress = recoverTypedData(typedData, sig);
    if (recoveredAddress !== from) {
        Sentry.captureMessage(
            `Invalid sig ${sig} of data ${JSON.stringify(typedData)} recovered ${recoveredAddress} instead of ${from}.`
        );
    }
    return sig;
}
