import {createConstant} from "../../../../util/util";

function c<T>(p: T): T {
    return createConstant(p, "games/state");
}

export const CREATING_GAME = c("CREATING_GAME");

export const GAME_CREATED = c("GAME_CREATED");
export const ENDED_GAME = c("ENDED_GAME");
export const PLACE_BET = c("PLACE_BET");
export const INVALID_SEED = c("INVALID_SEED");
export const END_BET = c("END_BET");
export const CHANGE_STATUS = c("CHANGE_STATUS");
export const ENDED_WITH_REASON = c("ENDED_WITH_REASON");

export const USER_INITIATE_CONFLICT_END = c("INITIATE_CONFLICT_END");
export const USER_ABORT_CONFLICT_END = c("USER_ABORT_CONFLICT_END");
export const USER_CONFLICT_END = c("USER_CONFLICT_END");
export const USER_INITIATE_FORCE_END = c("USER_INITIATE_FORCE_END");
export const USER_ABORT_FORCE_END = c("USER_ABORT_FORCE_END");
export const SERVER_CONFLICT_END = c("SERVER_CONFLICT_END");

export const RESTORE_STATE = c("RESTORE_STATE");
export const CLEAR_STATE = c("CLEAR_STATE");
