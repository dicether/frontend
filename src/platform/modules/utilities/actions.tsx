import * as types from '../../../app/constants'
import {ActionCreateType} from "../../../util/util";


const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;

export const showErrorMessage = ca((message: string) => {
    const notification = {message, type: 'error'};
    return {type: types.CHANGE_NOTIFICATION, notification};
});
