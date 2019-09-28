import {Action, AnyAction} from "redux";

import {State} from "../rootReducer";

export function fixedLengthAddElement<T>(array: T[], element: T, maxLength: number): T[] {
    if (array.length >= maxLength) {
        return [...array.slice(array.length - maxLength + 1), element];
    } else {
        return [...array, element];
    }
}

export function fixedLengthAddElementFront<T>(array: T[], element: T, maxLength: number): T[] {
    if (array.length >= maxLength) {
        return [element, ...array.slice(0, maxLength - 1)];
    } else {
        return [element, ...array];
    }
}

export type GetState = () => State;

export type $Values<T extends object> = T[keyof T];

export type ActionType<T extends {[id: string]: (...args: any[]) => any}> = ReturnType<$Values<T>>;

export type ActionCreateType<T extends object> = (...args: any[]) => {type: $Values<T>};

export type ThunkAction1<R, S> = (dispatch: Dispatch, getState: () => S) => R;

export type ThunkAction2<R, S> = (dispatch: Dispatch) => R;

export type ThunkAction<R, S> = ThunkAction1<R, S> | ThunkAction2<R, S>;

export interface Dispatch<A extends Action = AnyAction> {
    <T extends A>(action: T): T;
    <R>(asyncAction: ThunkAction<R, State>): R;
}

export function createConstant<T>(p: T, prefix: string): T {
    const res = prefix + "/" + (p as any);
    return res as any;
}

export function assertNever(t: never) {
    // Empty
}

export function isLocalStorageAvailable() {
    const mod = "test";
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch (e) {
        return false;
    }
}

export function isSessionStorageAvailable() {
    const mod = "test";
    try {
        sessionStorage.setItem(mod, mod);
        sessionStorage.removeItem(mod);
        return true;
    } catch (e) {
        return false;
    }
}
