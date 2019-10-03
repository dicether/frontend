import {createConstant} from "../../../util/util";

function c<T>(p: T): T {
    return createConstant(p, "games/plinko");
}

export const CHANGE_VALUE = c("CHANGE_VALUE");
export const CHANGE_NUM = c("CHANGE_NUM");
