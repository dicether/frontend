import * as types from './constants';
import {ActionCreateType} from "../../../util/util";


const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;


export const changeWeb3 = ca((web3: object|null) => {
    return {type: types.CHANGE_WEB3, web3}
});


export const changeAccount = ca((account: string|null) => {
    return {type: types.CHANGE_ACCOUNT, account};
});


export const changeNetworkId = ca((networkId: number|null) => {
    return {type: types.CHANGE_NETWORK, networkId};
});

export const changeContract = ca((contract: object|null) => {
    return {type: types.CHANGE_CONTRACT, contract};
});


export const changeBalance = ca((balance: number|null) => {
    return {type: types.CHANGE_BALANCE, balance};
});
