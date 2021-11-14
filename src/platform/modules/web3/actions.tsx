import Web3 from "web3";

import {ActionCreateType} from "../../../util/util";
import * as types from "./constants";

const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;

export const changeWeb3 = ca((web3: Web3 | null) => {
    return {type: types.CHANGE_WEB3, web3};
});

export const changeAccount = ca((account: string | null) => {
    return {type: types.CHANGE_ACCOUNT, account};
});

export const changeChainId = ca((chainId: number | null) => {
    return {type: types.CHANGE_NETWORK, chainId};
});

export const changeContract = ca((contract: any | null) => {
    return {type: types.CHANGE_CONTRACT, contract};
});

export const changeBalance = ca((balance: number | null) => {
    return {type: types.CHANGE_BALANCE, balance};
});
