import * as types from '../../../app/constants'
import {ActionType} from "../../../util/util";
import * as actions from './actions';


export type Actions = ActionType<typeof actions>;

export type State = {
    notification: string|null;
}

const initialState = {
    notification: null
};


export default function reducer(state = initialState, action: Actions): State {
    switch (action.type) {
        case types.CHANGE_NOTIFICATION:
            return Object.assign({}, state, {
                notification: action.notification
            });
        default:
            return state;
    }
}
