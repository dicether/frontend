import {User} from "../account/types";

export interface Message {
    user: User
    message: string,
    timestamp: number
}
