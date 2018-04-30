import {User} from "../account/types";

export type Friend = {
    user: User,
    date: Date,
    online: boolean
}
export type FriendRequest = {
    from: User,
    to: User,
    date: Date
}

export type FriendOnlineStatus = {
    address: string,
    online: boolean
}
