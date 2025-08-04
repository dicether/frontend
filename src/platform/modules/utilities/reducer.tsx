import * as actions from "./actions";
import * as types from "../../../app/constants";
import {ActionType} from "../../../util/util";

export type Actions = ActionType<typeof actions>;

export interface State {
    notification: {message: string; type: string} | null;
    nightMode: boolean;
}

const initialState: State = {
    notification: null,
    nightMode: localStorage.getItem("night") === "night",
};

export default function reducer(state = initialState, action: Actions): State {
    switch (action.type) {
        case types.CHANGE_NOTIFICATION:
            return {...state, notification: action.notification};
        case types.TOGGLE_THEME:
            localStorage.setItem("night", action.nightMode ? "night" : "day");
            return {...state, nightMode: action.nightMode};
        default:
            return state;
    }
}
