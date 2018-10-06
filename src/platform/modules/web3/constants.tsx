import {createConstant} from "../../../util/util";

function c<T>(p: T): T {
    return createConstant(p, "web3");
}

export const CHANGE_WEB3 = c("CHANGE_WEB3");
export const CHANGE_ACCOUNT = c("CHANGE_ACCOUNT");
export const CHANGE_NETWORK = c("CHANGE_NETWORK");
export const CHANGE_CONTRACT = c("CHANGE_CONTRACT");
export const CHANGE_BALANCE = c("CHANGE_BALANCE");
