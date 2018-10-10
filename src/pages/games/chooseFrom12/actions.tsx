import {ActionCreateType} from "../../../util/util";
import * as types from "./constants";

const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;

export const changeValue = ca((value: number) => {
    return {type: types.CHANGE_VALUE, value};
});

export const changeNum = ca((num: number) => {
    return {type: types.CHANGE_NUM, num};
});
