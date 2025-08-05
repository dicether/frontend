import * as types from "./constants";
import {ActionCreateType} from "../../../util/util";

const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;

export const changeValue = ca((value: number) => {
    return {type: types.CHANGE_VALUE, value};
});

export const changeNum = ca((num: number) => {
    return {type: types.CHANGE_NUM, num};
});

export const changeRollMode = ca((reverseRoll: boolean) => {
    return {type: types.CHANGE_ROLL_MODE, reverseRoll};
});
