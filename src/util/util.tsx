import {Dispatch as ReduxDispatch} from 'redux';

import {State} from '../rootReducer';


export function fixedLengthAddElement<T>(array: Array<T>, element: T, maxLength: number): Array<T> {
    if (array.length >= maxLength) {
        return [...array.slice(array.length - maxLength + 1), element]
    } else {
        return [...array, element];
    }
}

export function fixedLengthAddElementFront<T>(array: Array<T>, element: T, maxLength: number): Array<T> {
    if (array.length >= maxLength) {
        return [element, ...array.slice(0, maxLength - 1)]
    } else {
        return [element, ...array];
    }
}


export type GetState = () => State;

export type $Values<T extends object> = (
  T[keyof T]
);

export type ActionType<T extends {[id: string]: (...args: any[]) => any}> = (ReturnType<$Values<T>>);

export type ActionCreateType<T extends object> = (...args: any[]) => { type: $Values<T>}


export type ThunkAction<R, S> = (dispatch: ReduxDispatch, getState?: () => S) => R;

export interface ThunkDispatch<S> {
    (asyncAction: ThunkAction<any, S>): any;
}

export type Dispatch = ReduxDispatch & ThunkDispatch<State>;

export type DispatchProp = {
    dispatch: Dispatch;
}


export function createConstant<T>(p: T, prefix: string): T {
    const res = prefix + '/' + (p as any);
    return (res as any);
}

export function assertNever(t: never) {
    // Empty
}


export function isLocalStorageAvailable() {
    const mod = 'test';
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch (e) {
        return false;
    }
}

export function isSessionStorageAvailable() {
    const mod = 'test';
    try {
        sessionStorage.setItem(mod, mod);
        sessionStorage.removeItem(mod);
        return true;
    } catch (e) {
        return false;
    }
}
