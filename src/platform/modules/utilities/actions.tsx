import * as types from '../../../app/constants'
import {ActionCreateType} from "../../../util/util";


const ca = <T extends ActionCreateType<typeof types>>(a: T) => a;

export const showErrorMessage = ca((message: string) => {
    const notification = {message, type: 'error'};
    return {type: types.CHANGE_NOTIFICATION, notification};
});

export const showSuccessMessage = ca((message: string) => {
    const notification = {message, type: 'success'};
    return {type: types.CHANGE_NOTIFICATION, notification};
});

export const showInfoMessage = ca((message: string) => {
    const notification = {message, type: 'info'};
    return {type: types.CHANGE_NOTIFICATION, notification};
});

export const toggleTheme = ca((nightMode: boolean) => {
    return {type: types.TOGGLE_THEME, nightMode};
});
