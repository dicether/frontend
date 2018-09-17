import {User} from "../account/types";

export interface Message {
    id: number,
    user: User
    message: string,
    timestamp: number
}
