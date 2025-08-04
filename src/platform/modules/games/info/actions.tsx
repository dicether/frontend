import * as types from "./constants";
import {ActionCreateType} from "../../../../util/util";

const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;

export const toggleHelp = ca((show: boolean) => {
    return {type: types.TOGGLE_HELP, show};
});

export const toggleExpertView = ca((show: boolean) => {
    return {type: types.TOGGLE_EXPERT_VIEW, show};
});

export const toggleSound = ca((enabled: boolean) => {
    return {type: types.TOGGLE_SOUND, enabled};
});
